import type { CreateProjectFormValues } from './useProjectWizard'

export interface WizardStepProgress {
  1: number
  2: number
  3: number
  4: number
  5: number
}

export interface WizardProgress {
  total: number
  steps: WizardStepProgress
}

const isNonEmptyString = (val: unknown): val is string =>
  typeof val === 'string' && val.trim().length > 0

const calculateStringListScore = (list: unknown[] | undefined, minRequired: number = 2): number => {
  if (!Array.isArray(list) || list.length === 0) return 0
  const filledCount = list.filter(isNonEmptyString).length
  if (filledCount === 0) return 0
  const targetCount = Math.max(minRequired, list.length)
  return Math.min(1, filledCount / targetCount)
}

const calculateAudienceScore = (audienceList: unknown[] | undefined, minRequired: number = 1): number => {
  if (!Array.isArray(audienceList) || audienceList.length === 0) return 0
  const filledCount = audienceList.filter((item) => {
    if (!item || typeof item !== 'object') return false
    const seg = item as { title?: unknown; description?: unknown }
    return isNonEmptyString(seg.title) && isNonEmptyString(seg.description)
  }).length
  if (filledCount === 0) return 0
  const targetCount = Math.max(minRequired, audienceList.length)
  return Math.min(1, filledCount / targetCount)
}

const calculateRolesScore = (roles: unknown[] | undefined, minRequired: number = 1): number => {
  if (!Array.isArray(roles) || roles.length === 0) return 0
  const filledCount = roles.filter((item) => {
    if (!item || typeof item !== 'object') return false
    const r = item as { roleTypeId?: unknown; meta?: { name?: unknown }; placesCount?: unknown }
    return isNonEmptyString(r.roleTypeId) && isNonEmptyString(r.meta?.name) && typeof r.placesCount === 'number' && r.placesCount >= 1
  }).length
  if (filledCount === 0) return 0
  const targetCount = Math.max(minRequired, roles.length)
  return Math.min(1, filledCount / targetCount)
}

const calculateLinksScore = (links: unknown[] | undefined, minRequired: number = 2): number => {
  if (!Array.isArray(links) || links.length === 0) return 0
  const filledCount = links.filter((item) => {
    if (!item || typeof item !== 'object') return false
    const l = item as { link?: unknown }
    return isNonEmptyString(l.link)
  }).length
  if (filledCount === 0) return 0
  const targetCount = Math.max(minRequired, links.length)
  return Math.min(1, filledCount / targetCount)
}

export const calculateProjectWizardProgress = (
  values?: Partial<CreateProjectFormValues>
): WizardProgress => {
  if (!values) {
    return {
      total: 0,
      steps: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
  }

  const step1Progress = isNonEmptyString(values.type) ? 100 : 0

  const step2Scores = [
    isNonEmptyString(values.meta?.title) ? 1 : 0,
    isNonEmptyString(values.meta?.description) ? 1 : 0,
    isNonEmptyString(values.primaryTag) ? 1 : 0,
    calculateStringListScore(values.tags, 1),
    isNonEmptyString(values.partnerId) ? 1 : 0,
  ]
  const step2Progress = Math.round(
    (step2Scores.reduce((acc, s) => acc + s, 0) / step2Scores.length) * 100
  )

  const step3Scores: number[] = []
  if (values.prdMeta) {
    const prd = values.prdMeta as Record<string, unknown>
    if (values.type === 'Study') {
      step3Scores.push(
        isNonEmptyString(prd.prerequisites) ? 1 : 0,
        isNonEmptyString(prd.projectGoal) ? 1 : 0,
        calculateStringListScore(prd.keyFunctionality as unknown[], 2)
      )
    } else if (values.type === 'Case') {
      step3Scores.push(
        isNonEmptyString(prd.prerequisites) ? 1 : 0,
        calculateAudienceScore(prd.audience as unknown[], 1),
        isNonEmptyString(prd.projectGoal) ? 1 : 0,
        calculateStringListScore(prd.functional as unknown[], 2),
        isNonEmptyString(prd.problemStatement) ? 1 : 0
      )
    } else if (values.type === 'Real') {
      step3Scores.push(
        isNonEmptyString(prd.prerequisites) ? 1 : 0,
        isNonEmptyString(prd.productVision) ? 1 : 0,
        calculateAudienceScore(prd.audience as unknown[], 1),
        isNonEmptyString(prd.projectGoal) ? 1 : 0,
        isNonEmptyString(prd.businessGoal) ? 1 : 0,
        calculateStringListScore(prd.functional as unknown[], 2),
        calculateStringListScore(prd.nonFunctional as unknown[], 2),
        calculateStringListScore(prd.keyFunctionality as unknown[], 2),
        isNonEmptyString(prd.problemStatement) ? 1 : 0,
        calculateStringListScore(prd.businessMetrics as unknown[], 2),
        calculateStringListScore(prd.projectPlan as unknown[], 2)
      )
    }
  }
  const step3Progress = step3Scores.length > 0
    ? Math.round((step3Scores.reduce((acc, s) => acc + s, 0) / step3Scores.length) * 100)
    : 0

  const step4Progress = Math.round(calculateRolesScore(values.roles, 1) * 100)

  const step5Progress = Math.round(calculateLinksScore(values.links, 2) * 100)

  const steps: WizardStepProgress = {
    1: step1Progress,
    2: step2Progress,
    3: step3Progress,
    4: step4Progress,
    5: step5Progress,
  }

  const total = Math.round(
    (step1Progress + step2Progress + step3Progress + step4Progress + step5Progress) / 5
  )

  return { total, steps }
}
