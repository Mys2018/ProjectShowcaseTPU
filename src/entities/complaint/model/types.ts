export type ComplaintStatus = 'Dismissed' | 'Pending' | 'Resolved'

export interface Complaint {
  id: string
  reporterId: number
  targetUserId: number
  reason: string
  status: ComplaintStatus
  createdAt: string
  resolvedAt?: string
  resolvedBy?: number
}

export interface FileComplaintRequest {
  targetUserId?: number
  reason: string
}

export interface FileComplaintResponse {
  id: string
}

export interface ComplaintSearchResponse {
  items: Complaint[]
  total: number
  offset: number
  limit: number
}

export interface GetModerationComplaintsParams {
  offset?: number
  limit?: number
}

export interface ResolveComplaintRequest {
  status: ComplaintStatus
}
