import { describe, it, expect } from 'vitest';
import { countPossibleSecrets } from './combinatorics.js';
describe('countPossibleSecrets', () => {
    it('calculates permutations for binary base (length 2, base 2 -> 2)', () => {
        expect(countPossibleSecrets(2, 2)).toBe(2);
    });
    it('calculates permutations for decimal base (length 4, base 10 -> 5040)', () => {
        expect(countPossibleSecrets(4, 10)).toBe(5040);
    });
    it('calculates permutations for hex base (length 6, base 16 -> 5765760)', () => {
        expect(countPossibleSecrets(6, 16)).toBe(5765760);
    });
    it('returns 0 when length exceeds base', () => {
        expect(countPossibleSecrets(3, 2)).toBe(0);
    });
    it('returns cached result on repeated calls', () => {
        const first = countPossibleSecrets(5, 10);
        const second = countPossibleSecrets(5, 10);
        expect(first).toBe(30240);
        expect(second).toBe(first);
    });
});
