export const PROJECT_LIMITS = {
  meta: {
    title: { min: 35, max: 100 },
    description: { min: 100, max: 500 },
  },

  audience: {
    count: { min: 1, max: 3 },
    title: { min: 1, max: 70 },
    description: { min: 50, max: 200 },
    age: { min: 1, max: 100 },
  },

  prd: {
    prerequisites: { min: 200, max: 600 },
    productVision: { min: 100, max: 500 },
    projectGoal: { min: 100, max: 500 },
    businessGoal: { min: 100, max: 500 },
    problemStatement: { min: 100, max: 1500 },
  },

  lists: {
    count: { min: 2, max: 12 },
    itemLength: { min: 50, max: 200 },
  },

  projectPlan: {
    count: { min: 1, max: 12 },
    itemLength: { min: 100, max: 400 },
  },
} as const