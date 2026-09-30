import type { ContributionDay, ProfileData } from './github.ts';
import type { Quote } from './quotes.ts';

const FONT = "'Segoe UI', Ubuntu, 'Helvetica Neue', Arial, sans-serif";
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const QUOTE_CHARS_PER_LINE = 72;

const PALETTE = {
  from: '#303030',
  to: '#050505',
  border: '#3a3a3a',
  divider: '#262626',
  title: '#f5f5f5',
  text: '#bdbdbd',
  muted: '#7a7a7a',
  accent: '#e8e8e8',
  bar: '#8c8c8c',
};

interface Point {
  x: number;
  y: number;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

function frame(width: number, height: number, label: string, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${PALETTE.from}"/>
      <stop offset="1" stop-color="${PALETTE.to}"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${PALETTE.accent}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${PALETTE.accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="12" fill="url(#background)" stroke="${PALETTE.border}"/>
  <g font-family="${FONT}">
${body}
  </g>
</svg>
`;
}

function smoothPath(points: Point[], top: number, bottom: number): string {
  const clampY = (y: number): number => Math.min(bottom, Math.max(top, y));

  if (points.length === 0) {
    return '';
  }

  let path = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index];
    const current = points[index];
    const next = points[index + 1];
    const after = points[index + 2] ?? next;
    const control1 = { x: current.x + (next.x - previous.x) / 6, y: clampY(current.y + (next.y - previous.y) / 6) };
    const control2 = { x: next.x - (after.x - current.x) / 6, y: clampY(next.y - (after.y - current.y) / 6) };
    path += ` C${control1.x.toFixed(1)},${control1.y.toFixed(1)} ${control2.x.toFixed(1)},${control2.y.toFixed(1)} ${next.x.toFixed(1)},${next.y.toFixed(1)}`;
  }

  return path;
}

export function groupByWeek(days: ContributionDay[]): ContributionDay[] {
  const weeks: ContributionDay[] = [];

  for (let index = 0; index < days.length; index += 7) {
    const slice = days.slice(index, index + 7);
    weeks.push({ date: slice[0].date, count: slice.reduce((total, day) => total + day.count, 0) });
  }

  return weeks;
}

function yearsSince(isoDate: string, now: Date): number {
  const created = new Date(isoDate);
  let years = now.getUTCFullYear() - created.getUTCFullYear();
  const anniversaryPassed =
    now.getUTCMonth() > created.getUTCMonth() ||
    (now.getUTCMonth() === created.getUTCMonth() && now.getUTCDate() >= created.getUTCDate());

  if (!anniversaryPassed) {
    years -= 1;
  }

  return Math.max(years, 0);
}

export function renderContributionsCard(profile: ProfileData, now: Date): string {
  const width = 800;
  const height = 210;
  const chart = { left: 340, right: 770, top: 50, bottom: 160 };
  const weeks = groupByWeek(profile.days);
  const peak = Math.max(1, ...weeks.map((week) => week.count));
  const step = weeks.length > 1 ? (chart.right - chart.left) / (weeks.length - 1) : 0;
  const points = weeks.map((week, index) => ({
    x: chart.left + index * step,
    y: chart.bottom - (week.count / peak) * (chart.bottom - chart.top),
  }));
  const line = smoothPath(points, chart.top, chart.bottom);
  const area = points.length > 0 ? `${line} L${chart.right},${chart.bottom} L${chart.left},${chart.bottom} Z` : '';

  const monthLabels = weeks
    .map((week, index) => ({ week, index }))
    .filter(({ week, index }) => index > 0 && new Date(week.date).getUTCMonth() !== new Date(weeks[index - 1].date).getUTCMonth())
    .map(({ week, index }) => {
      const x = chart.left + index * step;
      return `    <text x="${x.toFixed(1)}" y="${chart.bottom + 22}" font-size="11" fill="${PALETTE.muted}" text-anchor="middle">${MONTHS[new Date(week.date).getUTCMonth()]}</text>`;
    })
    .join('\n');

  const years = yearsSince(profile.createdAt, now);
  const joined = years === 0 ? 'Joined GitHub this year' : `Joined GitHub ${years} year${years === 1 ? '' : 's'} ago`;
  const details = [
    `${formatNumber(profile.contributionsLastYear)} contributions in the last year`,
    `${formatNumber(profile.publicRepos)} public repositories`,
    joined,
    ...(profile.location ? [profile.location] : []),
  ];

  const detailLines = details
    .map((detail, index) => `    <text x="30" y="${92 + index * 26}" font-size="14" fill="${PALETTE.text}">${escapeXml(detail)}</text>`)
    .join('\n');

  const body = `    <text x="30" y="52" font-size="22" font-weight="600" fill="${PALETTE.title}">${escapeXml(profile.name)}</text>
${detailLines}
    <text x="${chart.right}" y="30" font-size="11" fill="${PALETTE.muted}" text-anchor="end">Weekly contributions · last 12 months</text>
    <line x1="${chart.left}" y1="${chart.bottom}" x2="${chart.right}" y2="${chart.bottom}" stroke="${PALETTE.divider}"/>
    <path d="${area}" fill="url(#fade)"/>
    <path d="${line}" fill="none" stroke="${PALETTE.accent}" stroke-width="2" stroke-linecap="round"/>
${monthLabels}`;

  return frame(width, height, `${profile.name}: ${details[0]}`, body);
}

export function renderStatsCard(profile: ProfileData): string {
  const width = 395;
  const height = 210;
  const rows: [string, number][] = [
    ['Commits (last year)', profile.commitsLastYear],
    ['Pull requests', profile.pullRequests],
    ['Issues', profile.issues],
    ['Stars earned', profile.stars],
    ['Contributed to', profile.contributedTo],
  ];

  const rowMarkup = rows
    .map(([label, value], index) => {
      const y = 82 + index * 26;
      const divider =
        index < rows.length - 1
          ? `\n    <line x1="30" y1="${y + 9}" x2="${width - 30}" y2="${y + 9}" stroke="${PALETTE.divider}"/>`
          : '';
      return `    <text x="30" y="${y}" font-size="14" fill="${PALETTE.text}">${label}</text>
    <text x="${width - 30}" y="${y}" font-size="14" font-weight="600" fill="${PALETTE.title}" text-anchor="end">${formatNumber(value)}</text>${divider}`;
    })
    .join('\n');

  const body = `    <text x="30" y="46" font-size="18" font-weight="600" fill="${PALETTE.title}">GitHub stats</text>
${rowMarkup}`;

  return frame(width, height, 'GitHub stats', body);
}

export function renderHoursCard(commitHours: number[], utcOffset: number): string {
  const width = 395;
  const height = 210;
  const chart = { left: 30, right: width - 30, top: 70, bottom: 170 };
  const total = commitHours.reduce((sum, count) => sum + count, 0);
  const peak = Math.max(...commitHours);
  const slot = (chart.right - chart.left) / 24;
  const barWidth = slot - 4;
  const offsetLabel = `UTC${utcOffset >= 0 ? '+' : '−'}${Math.abs(utcOffset)}`;

  const bars = commitHours
    .map((count, hour) => {
      const x = chart.left + hour * slot + 2;
      const barHeight = peak > 0 ? Math.max((count / peak) * (chart.bottom - chart.top), count > 0 ? 3 : 1) : 1;
      const fill = count > 0 && count === peak ? PALETTE.accent : count > 0 ? PALETTE.bar : PALETTE.divider;
      return `    <rect x="${x.toFixed(1)}" y="${(chart.bottom - barHeight).toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" rx="2" fill="${fill}"/>`;
    })
    .join('\n');

  const hourLabels = [0, 6, 12, 18, 23]
    .map((hour) => {
      const x = chart.left + hour * slot + slot / 2;
      return `    <text x="${x.toFixed(1)}" y="${chart.bottom + 20}" font-size="11" fill="${PALETTE.muted}" text-anchor="middle">${String(hour).padStart(2, '0')}h</text>`;
    })
    .join('\n');

  const empty =
    total === 0
      ? `\n    <text x="${width / 2}" y="${(chart.top + chart.bottom) / 2}" font-size="13" fill="${PALETTE.muted}" text-anchor="middle">No commits in the last year</text>`
      : '';

  const body = `    <text x="30" y="46" font-size="18" font-weight="600" fill="${PALETTE.title}">Commits by hour</text>
    <text x="${width - 30}" y="46" font-size="12" fill="${PALETTE.muted}" text-anchor="end">${offsetLabel} · ${formatNumber(total)} commits</text>
${bars}
${hourLabels}${empty}`;

  return frame(width, height, `Commits by hour of the day (${offsetLabel})`, body);
}

export function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let current = '';

  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

export function renderQuoteCard(quote: Quote): string {
  const width = 800;
  const lines = wrapText(quote.text, QUOTE_CHARS_PER_LINE);
  const firstLineY = 62;
  const lineHeight = 30;
  const authorY = firstLineY + lines.length * lineHeight + 14;
  const height = authorY + 30;

  const quoteLines = lines
    .map((line, index) => `    <text x="80" y="${firstLineY + index * lineHeight}" font-size="19" font-style="italic" fill="${PALETTE.title}">${escapeXml(line)}</text>`)
    .join('\n');

  const body = `    <text x="28" y="86" font-size="84" font-family="Georgia, serif" fill="${PALETTE.border}">“</text>
${quoteLines}
    <text x="${width - 40}" y="${authorY}" font-size="14" fill="${PALETTE.muted}" text-anchor="end">— ${escapeXml(quote.author)}</text>`;

  return frame(width, height, `"${quote.text}" — ${quote.author}`, body);
}
