const ROTATION_MS = 12 * 60 * 60 * 1000;

export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
  { text: 'Simplicity is prerequisite for reliability.', author: 'Edsger W. Dijkstra' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
  { text: 'Premature optimization is the root of all evil.', author: 'Donald Knuth' },
  { text: 'Code is like humor. When you have to explain it, it’s bad.', author: 'Cory House' },
];

export function pickQuote(now: Date, quotes: Quote[] = QUOTES): Quote {
  const index = Math.floor(now.getTime() / ROTATION_MS) % quotes.length;
  return quotes[index];
}
