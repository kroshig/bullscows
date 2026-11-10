import { describe, it, expect } from 'vitest';
import { evaluateGuess } from './evaluate.js';

describe('evaluateGuess', () => {
  it('returns all bulls when guess matches secret exactly', () => {
    expect(evaluateGuess('0123', '0123')).toEqual({ bulls: 4, cows: 0 });
  });

  it('returns all cows when all digits are present but in wrong positions', () => {
    expect(evaluateGuess('0123', '3210')).toEqual({ bulls: 0, cows: 4 });
  });

  it('returns mixed bulls and cows accurately', () => {
    expect(evaluateGuess('1234', '1435')).toEqual({ bulls: 2, cows: 1 });
  });

  it('returns 0 bulls and 0 cows when no digits match', () => {
    expect(evaluateGuess('0123', '4567')).toEqual({ bulls: 0, cows: 0 });
  });

  it('is case-insensitive for hexadecimal strings', () => {
    expect(evaluateGuess('0a1f', '0F1A')).toEqual({ bulls: 2, cows: 2 });
  });
});
