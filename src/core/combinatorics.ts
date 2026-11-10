export const memoize = <Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  keyResolver: (...args: Args) => string = (...args) => args.join(':'),
): ((...args: Args) => Result) => {
  const cache = new Map<string, Result>();
  return (...args: Args): Result => {
    const key = keyResolver(...args);
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

export const countPossibleSecrets: (length: number, base: number) => number = memoize(
  (length: number, base: number): number => {
    if (length < 0 || base < 0 || length > base) return 0;
    if (length === 0) return 1;
    return base * countPossibleSecrets(length - 1, base - 1);
  },
);
