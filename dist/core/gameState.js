import { evaluateGuess } from './evaluate.js';
import { generateSecret } from './secret.js';
import { isValidGuess } from './validator.js';
export const createInitialState = (settings = { length: 4, base: 10 }) => ({
    status: 'settings',
    settings,
    secret: '',
    history: [],
    startTimeMs: null,
    elapsedSeconds: 0,
    errorMessage: null,
});
export const updateSettings = (state, newSettings) => {
    if (state.status !== 'settings')
        return state;
    const merged = { ...state.settings, ...newSettings };
    const safeLength = Math.min(merged.length, merged.base);
    return {
        ...state,
        settings: { ...merged, length: safeLength },
    };
};
export const startRound = (state, nowMs, random = Math.random) => ({
    ...state,
    status: 'playing',
    secret: generateSecret(state.settings.length, state.settings.base, random),
    history: [],
    startTimeMs: nowMs,
    elapsedSeconds: 0,
    errorMessage: null,
});
export const submitGuess = (state, rawGuess, nowMs) => {
    if (state.status !== 'playing')
        return state;
    const normalized = rawGuess.toLowerCase();
    if (!isValidGuess(normalized, state.settings.length, state.settings.base)) {
        return { ...state, errorMessage: 'Некорректная длина или повторяющиеся символы' };
    }
    const isDuplicate = state.history.some((entry) => entry.guess === normalized);
    if (isDuplicate) {
        return { ...state, errorMessage: 'Эта комбинация уже проверялась' };
    }
    const result = evaluateGuess(state.secret, normalized);
    const nextEntry = {
        guess: normalized,
        result,
        attemptNumber: state.history.length + 1,
    };
    const nextHistory = [...state.history, nextEntry];
    const isWon = result.bulls === state.settings.length;
    const elapsedSeconds = state.startTimeMs
        ? Math.max(1, Math.round((nowMs - state.startTimeMs) / 1000))
        : 0;
    return {
        ...state,
        status: isWon ? 'won' : 'playing',
        history: nextHistory,
        elapsedSeconds,
        errorMessage: null,
    };
};
