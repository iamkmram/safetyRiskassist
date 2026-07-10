export const toSnake = (s) => s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
export const toCamel = (s) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
