export interface EvaluationResult {
  readonly bulls: number;
  readonly cows: number;
}

export const evaluateGuess = (secret: string, guess: string): EvaluationResult => {
  const secretChars = [...secret.toLowerCase()];
  const guessChars = [...guess.toLowerCase()];

  return guessChars.reduce<EvaluationResult>(
    (acc, char, index) => {
      if (char === secretChars[index]) {
        return { bulls: acc.bulls + 1, cows: acc.cows };
      }
      if (secretChars.includes(char)) {
        return { bulls: acc.bulls, cows: acc.cows + 1 };
      }
      return acc;
    },
    { bulls: 0, cows: 0 },
  );
};
