/* eslint-disable fsd/no-cross-slice-dependency */
/* eslint-disable fsd/forbidden-imports */
import type { DraftProgress, ProjectDraftResponse } from '../model/types'
import {
  calculateProjectWizardProgress,
  type CreateProjectFormValues,
  type WizardProgress,
} from '@/features/create-project'
import type { ProjectCardData, ProjectFormat, PrdMeta } from '@/entities/project'
import { mapDateToBackendString } from '@/shared'

export const mapDraftToProjectCardData = (
  draft: ProjectDraftResponse | Partial<CreateProjectFormValues> | null | undefined
): ProjectCardData | null => {
  if (!draft) return null

  const draftValues: Partial<CreateProjectFormValues> | undefined =
    'data' in draft ? (draft.data as Partial<CreateProjectFormValues>) : draft

  if (!draftValues || Object.keys(draftValues).length === 0) return null

  const primaryTagName = draftValues.extraFieldsForAll?.primaryTagName || 'Проект'
  const tags = (draftValues.extraFieldsForAll?.tags || []).map((name, idx) => ({
    id: `draft-tag-${idx}`,
    name,
    groupId: `draft-group-${idx}`,
  }))

  return {
    id: '',
    type: (draftValues.type as ProjectFormat) || 'Study',
    tags,
    primaryTag: {
      id: draftValues.primaryTag || 'draft-primary-tag',
      name: primaryTagName,
      groupId: 'draft-group-primary',
    },
    ownerId: 0,
    status: 'Pending',
    partner: {
      id: draftValues.partnerId || '',
      name: draftValues.extraFieldsForAll?.partnerName || '',
      profilePicture: '',
    },
    meta: {
      title: draftValues.meta?.title || 'Черновик проекта',
      description: draftValues.meta?.description || '',
    },
    checkpoints: {
      id: typeof draftValues.checkpoints === 'string' ? draftValues.checkpoints : 'draft-checkpoints',
      title: 'Ключевые точки',
      checkpoints: (Array.isArray(draftValues.customCheckpoints)
        ? draftValues.customCheckpoints
        : Array.isArray(draftValues.checkpoints)
          ? draftValues.checkpoints
          : []
      ).map(c => ({
        title: c.title,
        deadline: c.deadline ? new Date(c.deadline) : new Date(),
      })),
    },
    roles: (draftValues.roles || []).map(r => ({
      roleId: r.roleTypeId || '',
      placesCount: r.placesCount || 0,
      minPlacesCount: r.minPlacesCount || 0,
      places: 0,
      placeUserIds: [],
      meta: {
        name: r.meta?.name || 'Без названия',
        description: r.meta?.description || '',
      },
      skills: (r.skills || []).map(s => ({
        skillId: s.id,
        skillName: s.skillName,
      })),
    })),
    prdMeta: (draftValues.prdMeta || {}) as PrdMeta,
    isLiked: false,
    liked: false,
    hasMyReview: false,
  }
}

export const mapProjectToDraftValues = (
  project: ProjectCardData,
): Partial<CreateProjectFormValues> & { currentStep: number; highestStep: number; progress: WizardProgress } => {
  const values = {
    type: project.type,
    partnerId: project.partner.id,
    meta: project.meta,
    roles: project.roles.map(role => ({
      roleTypeId: role.roleTypeId ?? role.roleId,
      placesCount: role.placesCount,
      minPlacesCount: role.minPlacesCount,
      meta: role.meta,
      skills: role.skills.map(skill => ({ id: skill.skillId, skillName: skill.skillName })),
    })),
    primaryTag: project.primaryTag.id,
    tags: project.tags.map(tag => tag.id),
    checkpoints: project.checkpoints.id,
    customCheckpoints: project.checkpoints.checkpoints.map(checkpoint => ({
      title: checkpoint.title,
      deadline: mapDateToBackendString(checkpoint.deadline),
    })),
    links: [
      ...(project.repository ?? []).map(link => ({ platformId: link.platformId, name: link.name, category: 'Repository', link: link.url })),
      ...(project.taskTracker ?? []).map(link => ({ platformId: link.platformId, name: link.name, category: 'TaskTracker', link: link.url })),
      ...[...(project.otherPlatforms ?? []), ...(project.designEnvironment ?? [])].map(link => ({
        platformId: link.platformId,
        name: link.name,
        category: 'OtherPlatforms',
        link: link.url,
      })),
    ],
    prdMeta: project.prdMeta,
    extraFieldsForAll: {
      partnerName: project.partner.name,
      primaryTagName: project.primaryTag.name,
      tags: project.tags.map(tag => tag.name),
    },
  } as unknown as Partial<CreateProjectFormValues>

  return {
    ...values,
    currentStep: 1,
    highestStep: 5,
    progress: calculateProjectWizardProgress(values),
  }
}

export const getDraftProgress = (
  draft: ProjectDraftResponse | Partial<CreateProjectFormValues> | null | undefined
): DraftProgress => {
  if (!draft) {
    return { total: 0, steps: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
  }

  const data = typeof draft === 'object' && draft !== null && 'data' in draft
    ? (draft.data as Record<string, unknown>)
    : (draft as Record<string, unknown>)

  if (data && typeof data === 'object' && 'progress' in data && data.progress) {
    const saved = data.progress as DraftProgress
    if (typeof saved.total === 'number' && saved.steps) {
      return saved
    }
  }

  return calculateProjectWizardProgress(data as Partial<CreateProjectFormValues>)
}

