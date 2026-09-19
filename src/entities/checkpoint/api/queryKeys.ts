export const queryKeys = {
  all: ['checkpoints'] as const,
  current: ['checkpoints', 'current'] as const,
  group: (groupId: string) => [...queryKeys.all, groupId] as const
}
