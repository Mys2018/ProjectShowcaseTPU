import type { GetModerationComplaintsParams } from '../model/types'

export const complaintKeys = {
  all: ['complaints'] as const,
  moderationList: (params?: GetModerationComplaintsParams) =>
    [...complaintKeys.all, 'moderation', params] as const,
}
