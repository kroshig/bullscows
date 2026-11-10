const ALPHABET = '0123456789abcdef';
export const generateSecret = (length, base, random = Math.random) => {
    const pickFromPool = (pool, remaining) => {
        if (remaining <= 0 || pool.length === 0)
            return '';
        const index = Math.floor(random() * pool.length);
        const chosen = pool[index];
        const nextPool = pool.filter((_, idx) => idx !== index);
        return chosen + pickFromPool(nextPool, remaining - 1);
    };
    const initialPool = [...ALPHABET.slice(0, base)];
    return pickFromPool(initialPool, length);
};
