const all = ['users'] as const;

export const queryKeys = {
  all,
  status: [...all, 'auth', 'status'] as const,
  me: () => [...all, 'auth', 'me'] as const,
  user: (id: number) => [...all, 'user', id] as const,
  search: (query: string, offset = 0, limit = 20) => [...all, 'search', { query, limit, offset }] as const,
};