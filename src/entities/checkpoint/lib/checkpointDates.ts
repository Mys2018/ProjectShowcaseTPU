import type { Checkpoint } from '../model/types'

const DAY_MS = 1000 * 60 * 60 * 24

export const getDaysUntilCheckpoint = (checkpoint?: Checkpoint): number | null => {
  if (!checkpoint) return null
  return Math.ceil((checkpoint.deadline.getTime() - Date.now()) / DAY_MS)
}

export const isCheckpointPassed = (checkpoint?: Checkpoint): boolean => {
  if (!checkpoint) return false
  return checkpoint.deadline.getTime() <= Date.now()
}