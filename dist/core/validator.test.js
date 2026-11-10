import { describe, it, expect } from 'vitest';
import { createDigitValidator } from './validator.js';
import { isValidGuess } from './validator.js';
describe('createDigitValidator', () => {
    it('validates binary digits (base 2)', () => {
        const isBinary = createDigitValidator(2);
        expect(isBinary('0')).toBe(true);
        expect(isBinary('1')).toBe(true);
        expect(isBinary('2')).toBe(false);
        expect(isBinary('a')).toBe(false);
    });
    it('validates octal digits (base 8)', () => {
        const isOctal = createDigitValidator(8);
        expect(isOctal('7')).toBe(true);
        expect(isOctal('8')).toBe(false);
    });
    it('validates decimal digits (base 10)', () => {
        const isDecimal = createDigitValidator(10);
        expect(isDecimal('9')).toBe(true);
        expect(isDecimal('a')).toBe(false);
    });
    it('validates hex digits case-insensitively (base 16)', () => {
        const isHex = createDigitValidator(16);
        expect(isHex('a')).toBe(true);
        expect(isHex('F')).toBe(true);
        expect(isHex('g')).toBe(false);
        expect(isHex('')).toBe(false);
        expect(isHex('10')).toBe(false);
    });
});
describe('isValidGuess', () => {
    it('returns true for valid guess with unique digits matching length and base', () => {
        expect(isValidGuess('0123', 4, 10)).toBe(true);
        expect(isValidGuess('aB1F', 4, 16)).toBe(true);
    });
    it('returns false when length does not match', () => {
        expect(isValidGuess('123', 4, 10)).toBe(false);
        expect(isValidGuess('12345', 4, 10)).toBe(false);
    });
    it('returns false when digits are out of base range', () => {
        expect(isValidGuess('02', 2, 2)).toBe(false);
        expect(isValidGuess('1289', 4, 8)).toBe(false);
    });
    it('returns false when digits repeat (including different cases in hex)', () => {
        expect(isValidGuess('1123', 4, 10)).toBe(false);
        expect(isValidGuess('aA12', 4, 16)).toBe(false);
    });
});
