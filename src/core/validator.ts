const ALPHABET = "0123456789abcdef";

export const createDigitValidator = (
  base: number,
): ((char: string) => boolean) => {
  const allowedDigits = ALPHABET.slice(0, base);
  return (char: string): boolean =>
    char.length === 1 && allowedDigits.includes(char.toLowerCase());
};

export const isValidGuess = (
  guess: string,
  length: number,
  base: number,
): boolean => {
  if (guess.length !== length) return false;
  const isValidDigit = createDigitValidator(base);
  const normalizedChars = [...guess.toLowerCase()];
  return (
    normalizedChars.every(isValidDigit) &&
    new Set(normalizedChars).size === length
  );
};