import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { renderContributionsCard, renderHoursCard, renderQuoteCard, renderStatsCard } from './cards.ts';
import { fetchProfile } from './github.ts';
import { pickQuote } from './quotes.ts';

const OUTPUT_DIR = 'dist';
const DEFAULT_UTC_OFFSET = -3;

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const login = process.env.GITHUB_LOGIN;
  const utcOffset = Number(process.env.CARDS_UTC_OFFSET ?? DEFAULT_UTC_OFFSET);

  if (!token || !login) {
    throw new Error('Defina GITHUB_TOKEN e GITHUB_LOGIN');
  }

  const now = new Date();
  const profile = await fetchProfile(token, login, now, utcOffset);

  const cards: Record<string, string> = {
    'contributions.svg': renderContributionsCard(profile, now),
    'stats.svg': renderStatsCard(profile),
    'commits-by-hour.svg': renderHoursCard(profile.commitHours, utcOffset),
    'quote.svg': renderQuoteCard(pickQuote(now)),
  };

  await mkdir(OUTPUT_DIR, { recursive: true });
  await Promise.all(Object.entries(cards).map(([file, svg]) => writeFile(join(OUTPUT_DIR, file), svg)));
}

main().catch((error: unknown) => {
  console.error('[cards] Falha ao gerar os cards:', error);
  process.exitCode = 1;
});
