export const memoize = (fn, keyResolver = (...args) => args.join(':')) => {
    const cache = new Map();
    return (...args) => {
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
export const countPossibleSecrets = memoize((length, base) => {
    if (length < 0 || base < 0 || length > base)
        return 0;
    if (length === 0)
        return 1;
    return base * countPossibleSecrets(length - 1, base - 1);
});
