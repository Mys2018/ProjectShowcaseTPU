export const PROJECT_LIMITS = {
  // Общая мета проекта
  meta: {
    title: { min: 35, max: 100 },
    description: { min: 100, max: 500 },
  },

  // Сегменты целевой аудитории
  audience: {
    count: { min: 1, max: 3 }, // от 1 до 3 сегментов
    title: { min: 1, max: 70 },
    description: { min: 50, max: 200 },
    age: { min: 1, max: 100 },
  },

  // Текстовые поля PRD
  prd: {
    prerequisites: { min: 200, max: 600 },
    productVision: { min: 100, max: 500 },
    projectGoal: { min: 100, max: 500 },
    businessGoal: { min: 100, max: 500 },
    problemStatement: { min: 100, max: 1500 },
  },

  // Списки (функционал, требования, бизнес-метрики)
  lists: {
    count: { min: 2, max: 12 }, // кол-во пунктов в массиве
    itemLength: { min: 50, max: 200 }, // длина одного пункта
  },

  // План проекта (там другие лимиты для текста)
  projectPlan: {
    count: { min: 1, max: 12 }, // минимум 1 этап
    itemLength: { min: 100, max: 400 },
  },
} as const; // as const нужен, чтобы TypeScript намертво зафиксировал эти числа как литералы, а не просто number