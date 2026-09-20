import { api, ENDPOINTS } from '@/shared'
import type {
  ComplaintSearchResponse,
  FileComplaintRequest,
  FileComplaintResponse,
  GetModerationComplaintsParams,
  ResolveComplaintRequest,
} from '../model/types'

export const fileComplaint = async (payload: FileComplaintRequest): Promise<FileComplaintResponse> => {
  const { data } = await api.post<FileComplaintResponse>(ENDPOINTS.COMPLAINTS, {
    targetUserId: payload.targetUserId ?? 0,
    reason: payload.reason,
  })
  return data
}

export const getModerationComplaints = async (
  params?: GetModerationComplaintsParams
): Promise<ComplaintSearchResponse> => {
  const { data } = await api.get<ComplaintSearchResponse>(ENDPOINTS.MODERATION_COMPLAINTS, {
    params,
  })
  return data
}

export const resolveComplaint = async (
  id: string,
  payload: ResolveComplaintRequest
): Promise<void> => {
  await api.put(ENDPOINTS.MODERATION_COMPLAINT_BY_ID(id), payload)
}
