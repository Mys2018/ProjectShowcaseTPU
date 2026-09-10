import type { ProjectCardData } from '../model/types'

type ProjectDates = {
  opening: Date | undefined
  closure: Date | undefined
}

export const getProjectDates = (checkpoints: ProjectCardData['checkpoints']['checkpoints']): ProjectDates => {
  let closureDate: Date | undefined
  let openingDate: Date | undefined
  checkpoints.forEach(checkpoint => {
    const { deadline } = checkpoint
    if (!closureDate || deadline.getTime() > closureDate.getTime()) {
      closureDate = deadline
    }
  })
  return { opening: openingDate, closure: closureDate }
}
