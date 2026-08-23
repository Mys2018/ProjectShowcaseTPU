export const queryKeys = {
  all: ['partners'] as const,
  partner: (id: string) => [...queryKeys.all, 'partner', id] as const
}
