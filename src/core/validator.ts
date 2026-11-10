const ALPHABET = '0123456789abcdef';

export const createDigitValidator = (base: number): ((char: string) => boolean) => {
  const allowedDigits = ALPHABET.slice(0, base);
  return (char: string): boolean => char.length === 1 && allowedDigits.includes(char.toLowerCase());
};
