const GRAPHQL_URL = 'https://api.github.com/graphql';
const COMMITS_PAGE_SIZE = 100;
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export interface ContributionDay {
  date: string;
  count: number;
}

export interface ProfileData {
  login: string;
  name: string;
  location: string | null;
  createdAt: string;
  publicRepos: number;
  stars: number;
  pullRequests: number;
  issues: number;
  contributedTo: number;
  commitsLastYear: number;
  contributionsLastYear: number;
  days: ContributionDay[];
  commitHours: number[];
}

interface GraphQLError {
  message: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

interface OwnedRepository {
  name: string;
  stargazerCount: number;
  owner: { login: string };
}

interface ProfileQuery {
  user: {
    id: string;
    login: string;
    name: string | null;
    location: string | null;
    createdAt: string;
    publicRepos: { totalCount: number };
    ownedRepos: { nodes: OwnedRepository[] };
    pullRequests: { totalCount: number };
    issues: { totalCount: number };
    repositoriesContributedTo: { totalCount: number };
    contributionsCollection: {
      totalCommitContributions: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
      };
    };
  } | null;
}

interface CommitHistoryPage {
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  nodes: { authoredDate: string }[];
}

interface CommitHistoryQuery {
  repository: {
    defaultBranchRef: { target: { history?: CommitHistoryPage } } | null;
  } | null;
}

const PROFILE_QUERY = `
  query ($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      id
      login
      name
      location
      createdAt
      publicRepos: repositories(ownerAffiliations: OWNER, privacy: PUBLIC) { totalCount }
      ownedRepos: repositories(ownerAffiliations: OWNER, isFork: false, first: 100, orderBy: { field: PUSHED_AT, direction: DESC }) {
        nodes { name stargazerCount owner { login } }
      }
      pullRequests { totalCount }
      issues { totalCount }
      repositoriesContributedTo(includeUserRepositories: true, contributionTypes: [COMMIT, PULL_REQUEST, ISSUE, REPOSITORY]) { totalCount }
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }
`;

const COMMIT_HISTORY_QUERY = `
  query ($owner: String!, $name: String!, $author: ID!, $since: GitTimestamp!, $cursor: String) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: ${COMMITS_PAGE_SIZE}, since: $since, author: { id: $author }, after: $cursor) {
              pageInfo { hasNextPage endCursor }
              nodes { authoredDate }
            }
          }
        }
      }
    }
  }
`;

async function graphql<T>(token: string, query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'profile-cards',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL respondeu ${response.status}: ${await response.text()}`);
  }

  const payload = (await response.json()) as GraphQLResponse<T>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join('; '));
  }

  if (!payload.data) {
    throw new Error('GitHub GraphQL respondeu sem dados');
  }

  return payload.data;
}

export function toLocalHour(isoDate: string, utcOffset: number): number {
  const utcHour = new Date(isoDate).getUTCHours();
  return (((utcHour + utcOffset) % 24) + 24) % 24;
}

async function fetchCommitDates(
  token: string,
  repository: OwnedRepository,
  authorId: string,
  since: string,
): Promise<string[]> {
  const dates: string[] = [];
  let cursor: string | null = null;

  do {
    const data: CommitHistoryQuery = await graphql<CommitHistoryQuery>(token, COMMIT_HISTORY_QUERY, {
      owner: repository.owner.login,
      name: repository.name,
      author: authorId,
      since,
      cursor,
    });

    const history = data.repository?.defaultBranchRef?.target.history;

    if (!history) {
      break;
    }

    dates.push(...history.nodes.map((node) => node.authoredDate));
    cursor = history.pageInfo.hasNextPage ? history.pageInfo.endCursor : null;
  } while (cursor);

  return dates;
}

export async function fetchProfile(token: string, login: string, now: Date, utcOffset: number): Promise<ProfileData> {
  const from = new Date(now.getTime() - ONE_YEAR_MS).toISOString();
  const to = now.toISOString();
  const { user } = await graphql<ProfileQuery>(token, PROFILE_QUERY, { login, from, to });

  if (!user) {
    throw new Error(`Usuário ${login} não encontrado`);
  }

  const commitDates = await Promise.all(
    user.ownedRepos.nodes.map((repository) => fetchCommitDates(token, repository, user.id, from)),
  );

  const commitHours = new Array<number>(24).fill(0);

  for (const date of commitDates.flat()) {
    commitHours[toLocalHour(date, utcOffset)] += 1;
  }

  const calendar = user.contributionsCollection.contributionCalendar;

  return {
    login: user.login,
    name: user.name ?? user.login,
    location: user.location,
    createdAt: user.createdAt,
    publicRepos: user.publicRepos.totalCount,
    stars: user.ownedRepos.nodes.reduce((total, repository) => total + repository.stargazerCount, 0),
    pullRequests: user.pullRequests.totalCount,
    issues: user.issues.totalCount,
    contributedTo: user.repositoriesContributedTo.totalCount,
    commitsLastYear: user.contributionsCollection.totalCommitContributions,
    contributionsLastYear: calendar.totalContributions,
    days: calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })),
    ),
    commitHours,
  };
}
