export {};

export const toSnakeIdentity = (s: string): string => s;
export const toCamelIdentity = (s: string): string => s;

export const toSnake = (s: string): string =>
  s.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const toCamel = (s: string): string =>
  s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
