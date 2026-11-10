import { BaseOption } from './gameState.js';

export interface LeaderboardEntry {
  readonly attempts: number;
  readonly timeSeconds: number;
  readonly length: number;
  readonly base: BaseOption;
  readonly date: string;
}

const STORAGE_KEY = 'bulls_and_cows_leaderboard';
const MAX_RECORDS = 10;

export const sortAndLimitRecords = (
  records: readonly LeaderboardEntry[],
  newEntry: LeaderboardEntry,
): readonly LeaderboardEntry[] =>
  [...records, newEntry]
    .sort((a, b) =>
      a.attempts !== b.attempts ? a.attempts - b.attempts : a.timeSeconds - b.timeSeconds,
    )
    .slice(0, MAX_RECORDS);

export const loadLeaderboard = (): readonly LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
};

export const saveRecord = (entry: LeaderboardEntry): readonly LeaderboardEntry[] => {
  const current = loadLeaderboard();
  const updated = sortAndLimitRecords(current, entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
