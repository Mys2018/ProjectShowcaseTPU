export const queryKeys = {
  all: ['checkpoints'] as const,
  group: (groupId: string) => [...queryKeys.all, groupId] as const
}
