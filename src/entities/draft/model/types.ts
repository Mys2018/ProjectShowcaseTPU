export interface DraftStepProgress {
  1: number
  2: number
  3: number
  4: number
  5: number
}

export interface DraftProgress {
  total: number
  steps: DraftStepProgress
}

export interface ProjectDraftResponse {
  data: Record<string, unknown> & {
    progress?: DraftProgress
  }
  updatedAt: string
}

