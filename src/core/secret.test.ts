import { describe, it, expect } from 'vitest';
import { generateSecret } from './secret.js';
import { isValidGuess } from './validator.js';

describe('generateSecret', () => {
  it('generates deterministic secret with injected random function (including leading zero)', () => {
    const alwaysZero = () => 0;
    expect(generateSecret(4, 10, alwaysZero)).toBe('0123');
    expect(generateSecret(3, 16, alwaysZero)).toBe('012');
  });

  it('generates deterministic secret from the end of alphabet', () => {
    const alwaysLast = () => 0.9999;
    expect(generateSecret(4, 16, alwaysLast)).toBe('fedc');
  });

  it('produces valid secret of specified length and base', () => {
    const seq = [0.1, 0.5, 0.2, 0.8];
    let idx = 0;
    const customRandom = () => seq[idx++ % seq.length];
    const secret = generateSecret(4, 10, customRandom);
    expect(isValidGuess(secret, 4, 10)).toBe(true);
  });
});
