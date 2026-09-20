import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { complaintKeys } from './queryKeys'
import { fileComplaint, getModerationComplaints, resolveComplaint } from './requests'
import type {
  ComplaintSearchResponse,
  FileComplaintRequest,
  FileComplaintResponse,
  GetModerationComplaintsParams,
  ResolveComplaintRequest,
} from '../model/types'

export const useFileComplaint = () => {
  const queryClient = useQueryClient()

  return useMutation<FileComplaintResponse, AxiosError, FileComplaintRequest>({
    mutationFn: fileComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.all })
    },
  })
}

export const useModerationComplaints = (
  params?: GetModerationComplaintsParams,
  enabled: boolean = true
) => {
  return useQuery<ComplaintSearchResponse, AxiosError>({
    queryKey: complaintKeys.moderationList(params),
    queryFn: () => getModerationComplaints(params),
    enabled,
  })
}

export const useResolveComplaint = () => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError, { id: string; payload: ResolveComplaintRequest }>({
    mutationFn: ({ id, payload }) => resolveComplaint(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.all })
    },
  })
}
