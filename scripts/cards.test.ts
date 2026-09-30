import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  escapeXml,
  groupByWeek,
  renderContributionsCard,
  renderHoursCard,
  renderQuoteCard,
  renderStatsCard,
  wrapText,
} from './cards.ts';
import type { ContributionDay, ProfileData, ProfileUser } from './github.ts';
import { toLocalHour, toProfileData } from './github.ts';
import { pickQuote, QUOTES } from './quotes.ts';

const NOW = new Date('2026-09-29T12:00:00Z');

function buildDays(count: number): ContributionDay[] {
  return Array.from({ length: count }, (_, index) => ({
    date: new Date(Date.UTC(2025, 8, 28) + index * 86_400_000).toISOString().slice(0, 10),
    count: index % 5,
  }));
}

function buildProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    login: 'holandajvitor',
    name: 'Vitor Holanda',
    location: 'Brazil',
    createdAt: '2023-07-03T13:32:07Z',
    publicRepos: 4,
    stars: 1,
    pullRequests: 8,
    issues: 0,
    contributedTo: 3,
    commitsLastYear: 120,
    contributionsLastYear: 128,
    days: buildDays(365),
    commitHours: new Array<number>(24).fill(0),
    ...overrides,
  };
}

function isWellFormed(svg: string): boolean {
  return svg.startsWith('<svg') && svg.trimEnd().endsWith('</svg>') && !/[<&](?![a-zA-Z/!?#])/.test(svg);
}

describe('escapeXml', () => {
  it('escapa caracteres reservados do XML', () => {
    assert.equal(escapeXml(`<a href="x">Tom & Jerry's</a>`), '&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&apos;s&lt;/a&gt;');
  });
});

describe('toLocalHour', () => {
  it('converte a hora UTC para o fuso informado', () => {
    assert.equal(toLocalHour('2026-09-29T02:30:00Z', -3), 23);
    assert.equal(toLocalHour('2026-09-29T15:00:00Z', -3), 12);
    assert.equal(toLocalHour('2026-09-29T22:00:00Z', 5), 3);
  });
});

describe('toProfileData', () => {
  const user: ProfileUser = {
    id: 'U_1',
    login: 'holandajvitor',
    name: null,
    location: 'Brazil',
    createdAt: '2023-07-03T13:32:07Z',
    publicRepos: { totalCount: 5 },
    ownedRepos: {
      nodes: [
        { name: 'stockly', stargazerCount: 0, owner: { login: 'holandajvitor' } },
        { name: 'holandajvitor', stargazerCount: 1, owner: { login: 'holandajvitor' } },
      ],
    },
    pullRequests: { totalCount: 2 },
    issues: { totalCount: 0 },
    repositoriesContributedTo: { totalCount: 5 },
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: 114,
        weeks: [{ contributionDays: [{ date: '2026-09-28', contributionCount: 15 }] }],
      },
    },
  };

  it('conta os commits pelas datas coletadas, incluindo repositórios privados', () => {
    const commitDates = ['2026-09-28T18:00:00Z', '2026-09-28T19:30:00Z', '2026-09-29T02:00:00Z'];
    const profile = toProfileData(user, commitDates, -3);
    assert.equal(profile.commitsLastYear, 3);
    assert.equal(profile.commitHours.reduce((sum, count) => sum + count, 0), profile.commitsLastYear);
    assert.equal(profile.commitHours[15], 1);
    assert.equal(profile.commitHours[23], 1);
  });

  it('usa o login quando o nome não existe e soma as estrelas', () => {
    const profile = toProfileData(user, [], -3);
    assert.equal(profile.name, 'holandajvitor');
    assert.equal(profile.stars, 1);
    assert.equal(profile.commitsLastYear, 0);
    assert.deepEqual(profile.days, [{ date: '2026-09-28', count: 15 }]);
  });
});

describe('groupByWeek', () => {
  it('soma as contribuições de cada bloco de 7 dias', () => {
    const weeks = groupByWeek(buildDays(14));
    assert.equal(weeks.length, 2);
    assert.equal(weeks[0].count, 0 + 1 + 2 + 3 + 4 + 0 + 1);
  });

  it('aceita uma última semana incompleta', () => {
    assert.equal(groupByWeek(buildDays(10)).length, 2);
  });
});

describe('wrapText', () => {
  it('quebra linhas sem ultrapassar o limite de caracteres', () => {
    const lines = wrapText('one two three four five six', 9);
    assert.deepEqual(lines, ['one two', 'three', 'four five', 'six']);
  });

  it('mantém uma palavra maior que o limite na própria linha', () => {
    assert.deepEqual(wrapText('supercalifragilistic ok', 5), ['supercalifragilistic', 'ok']);
  });
});

describe('renderContributionsCard', () => {
  it('gera um SVG com o degradê e os dados do perfil', () => {
    const svg = renderContributionsCard(buildProfile(), NOW);
    assert.ok(isWellFormed(svg));
    assert.match(svg, /linearGradient id="background"/);
    assert.match(svg, /128 contributions in the last year/);
    assert.match(svg, /Joined GitHub 3 years ago/);
  });

  it('omite a localização quando não existe', () => {
    const svg = renderContributionsCard(buildProfile({ location: null }), NOW);
    assert.doesNotMatch(svg, /Brazil/);
  });

  it('escapa o nome do usuário', () => {
    const svg = renderContributionsCard(buildProfile({ name: 'A & B <script>' }), NOW);
    assert.match(svg, /A &amp; B &lt;script&gt;/);
    assert.ok(isWellFormed(svg));
  });

  it('mantém a curva dentro da área do gráfico', () => {
    const spiky = buildDays(365).map((day, index) => ({ ...day, count: index % 14 === 0 ? 40 : 0 }));
    const svg = renderContributionsCard(buildProfile({ days: spiky }), NOW);
    const line = /<path d="(M[^"]+)" fill="none"/.exec(svg)?.[1] ?? '';
    const ys = [...line.matchAll(/-?\d+(?:\.\d+)?,(-?\d+(?:\.\d+)?)/g)].map((match) => Number(match[1]));
    assert.ok(ys.length > 0);
    assert.ok(ys.every((y) => y >= 50 && y <= 160));
  });

  it('não quebra sem contribuições', () => {
    const svg = renderContributionsCard(buildProfile({ days: [] }), NOW);
    assert.ok(isWellFormed(svg));
  });
});

describe('renderStatsCard', () => {
  it('mostra os números formatados', () => {
    const svg = renderStatsCard(buildProfile({ commitsLastYear: 1234 }));
    assert.ok(isWellFormed(svg));
    assert.match(svg, />1,234</);
  });
});

describe('renderHoursCard', () => {
  it('desenha uma barra por hora e destaca o pico', () => {
    const hours = new Array<number>(24).fill(0);
    hours[15] = 10;
    hours[16] = 4;
    const svg = renderHoursCard(hours, -3);
    assert.equal((svg.match(/<rect /g) ?? []).length, 25);
    assert.match(svg, /UTC−3 · 14 commits/);
    assert.ok(isWellFormed(svg));
  });

  it('mostra um aviso quando não há commits', () => {
    const svg = renderHoursCard(new Array<number>(24).fill(0), -3);
    assert.match(svg, /No commits in the last year/);
  });
});

describe('renderQuoteCard', () => {
  it('ajusta a altura ao número de linhas', () => {
    const short = renderQuoteCard({ text: 'Short.', author: 'Someone' });
    const long = renderQuoteCard(QUOTES[4]);
    const heightOf = (svg: string): number => Number(/height="(\d+)"/.exec(svg)?.[1]);
    assert.ok(heightOf(long) > heightOf(short));
    assert.ok(isWellFormed(long));
  });
});

describe('pickQuote', () => {
  it('troca de citação a cada 12 horas', () => {
    const first = pickQuote(new Date('2026-09-29T00:00:00Z'));
    const same = pickQuote(new Date('2026-09-29T11:59:00Z'));
    const next = pickQuote(new Date('2026-09-29T12:00:00Z'));
    assert.equal(first, same);
    assert.notEqual(first, next);
  });
});
