export interface ProjectRoleLike {
  placeUserIds?: number[]
  meta?: {
    name?: string
  }
}

export interface ProjectLike {
  ownerId?: number
  roles?: ProjectRoleLike[]
}

export const getMemberRoleName = (
  userId?: number,
  project?: ProjectLike
): string => {
  if (!userId || !project?.roles) {
    return 'Участник'
  }

  const matchedRoles = project.roles.filter(role =>
    role.placeUserIds?.includes(userId)
  )

  if (matchedRoles.length > 0) {
    return matchedRoles
      .map(r => r.meta?.name)
      .filter(Boolean)
      .join(', ') || 'Участник'
  }

  if (project.ownerId === userId) {
    return 'Куратор проекта'
  }

  return 'Участник'
}
