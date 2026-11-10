export interface EvaluationResult {
  readonly bulls: number;
  readonly cows: number;
}

export const evaluateGuess = (_secret: string, _guess: string): EvaluationResult => ({
  bulls: -1,
  cows: -1,
});
