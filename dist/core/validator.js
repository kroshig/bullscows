const ALPHABET = '0123456789abcdef';
export const createDigitValidator = (base) => {
    const allowedDigits = ALPHABET.slice(0, base);
    return (char) => char.length === 1 && allowedDigits.includes(char.toLowerCase());
};
export const isValidGuess = (guess, length, base) => {
    if (guess.length !== length)
        return false;
    const isValidDigit = createDigitValidator(base);
    const normalizedChars = [...guess.toLowerCase()];
    return normalizedChars.every(isValidDigit) && new Set(normalizedChars).size === length;
};
