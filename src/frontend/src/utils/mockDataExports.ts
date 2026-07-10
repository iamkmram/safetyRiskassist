// FIXED placeholder  minimal valid TypeScript module
export const data = {
  placeholder: true,
};

/* Added by CHECK 4 script  placeholder mock data */
export const MOCK_USERS = [
  { id: 'user-001', name: 'Alice', role: 'Admin' },
  { id: 'user-002', name: 'Bob', role: 'User' },
];

export function mockAuthenticate(username: string, password: string): Promise<boolean> {
  // Very naive placeholder  always succeeds after a short delay
  return new Promise((resolve) => setTimeout(() => resolve(true), 100));
}
