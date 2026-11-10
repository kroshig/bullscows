const STORAGE_KEY = 'bulls_and_cows_leaderboard';
const MAX_RECORDS = 10;
export const sortAndLimitRecords = (records, newEntry) => [...records, newEntry]
    .sort((a, b) => a.attempts !== b.attempts ? a.attempts - b.attempts : a.timeSeconds - b.timeSeconds)
    .slice(0, MAX_RECORDS);
export const loadLeaderboard = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
};
export const saveRecord = (entry) => {
    const current = loadLeaderboard();
    const updated = sortAndLimitRecords(current, entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};
