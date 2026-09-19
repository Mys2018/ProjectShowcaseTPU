import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/shared'
import styles from './TestMenu.module.css'

// Хардкод эндпоинтов, чтобы не засорять shared/config/endpoints.ts
const ENDPOINTS = {
  ME_META: '/users/me',
  ROLE_TYPES: '/role-types',
  SKILLS: '/skills',
  TAGS: '/tags',
  TAG_GROUPS: '/tag-groups',
  PLATFORMS: '/platforms',
  PARTNERS: '/partners',
  CHECKPOINTS: '/projects/checkpoints',
  PROJECTS: '/projects',
}

interface RoleTypeItem {
  id?: string
  roleTypeId?: string
  name?: string
  roleTypeName?: string
}

interface TagItem {
  tagId: string
  tagName: string
}

interface TagGroupItem {
  groupId: string
  groupName: string
  tags?: TagItem[]
}

const SEED_COMPETENCIES = [
  {
    name: 'Frontend',
    skills: ['React', 'TypeScript', 'HTML/CSS', 'TanStack Query', 'Angular', 'Vue.js'],
  },
  {
    name: 'Backend',
    skills: ['Node.js', 'PostgreSQL', 'Golang', 'Java', 'Python', 'TypeScript', 'Kafka', 'Docker'],
  },
  {
    name: 'Mobile',
    skills: ['Flutter', 'React Native', 'Kotlin', 'JetpackCompose', 'Swift', 'QML'],
  },
  {
    name: 'Дизайнер',
    skills: ['Figma', 'UI/UX дизайн', 'Photoshop', 'AdobeIllustrator'],
  },
  {
    name: 'QA',
    skills: ['Ручное тестирование', 'Автотесты', 'Docker', 'CI/CD', 'Postman'],
  },
  {
    name: 'Аналитик',
    skills: ['Системный анализ', 'Бизнес-анализ', 'SQL', 'UML', 'BPMN'],
  },
  {
    name: 'ML-инженер',
    skills: ['PyTorch', 'TensorFlow', 'Computer Vision', 'NLP', 'Data Science'],
  },
]

const TARGET_TAGS = ['Веб-разработка', 'Инженерия', 'Мобайл-разработка', 'VR/AR', 'E-commerce', 'FinTech', 'Дизайн', 'ML/AI']

const SEED_PLATFORMS = [
  { name: 'GitHub', category: 'Repository' },
  { name: 'GitLab', category: 'Repository' },
  { name: 'Jira', category: 'TaskTracker' },
  { name: 'YouTrack', category: 'TaskTracker' },
  { name: 'Figma', category: 'OtherPlatforms' },
  { name: 'Miro', category: 'OtherPlatforms' },
]

const SEED_PARTNERS = [
  { name: 'Т-Банк' },
  { name: 'Газпром Нефть' },
  { name: 'Яндекс' },
  { name: 'Сбер' },
  { name: 'VK' },
  { name: 'FFP' },
]

const formatError = (err: any): string => {
  if (!err) return 'Неизвестная ошибка'
  const status = err.response?.status
  const data = err.response?.data
  if (status === 403) {
    return '403 (недостаточно прав)'
  }
  if (typeof data === 'string') {
    return `${status ? `${status}: ` : ''}${data}`
  }
  if (data?.msg) {
    return `${status ? `${status} ` : ''}${data.code ? `[${data.code}] ` : ''}${data.msg}`
  }
  if (data?.message) {
    return `${status ? `${status}: ` : ''}${data.message}`
  }
  if (err.message) {
    return err.message
  }
  return String(err)
}

export const TestMenu = () => {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{ text: string; isError?: boolean } | null>(null)

  const clearProfileData = async () => {
    try {
      await api.put(ENDPOINTS.ME_META, {
        bio: '',
        skills: [],
      })
      setStatus({ text: 'Данные профиля успешно очищены' })
    } catch (e) {
      console.error(e)
      setStatus({ text: 'Ошибка очистки профиля: ' + formatError(e), isError: true })
    }
  }

  const createBaseCheckpoints = async () => {
    setIsLoading(true)
    setStatus({ text: 'Создание набора чекпоинтов «Основа»...' })
    try {
      const payload = {
        checkpoints: [
          { title: 'Старт набора', deadline: '2026-09-19' },
          { title: 'Донабор', deadline: '2026-10-08' },
          { title: 'Защита проекта', deadline: '2027-01-21' },
        ],
      }
      const { data } = await api.post<any>(ENDPOINTS.CHECKPOINTS, payload)
      const checkpointId = data?.checkpointId || data?.id || ''
      await queryClient.invalidateQueries({ queryKey: ['checkpoints'] })
      setStatus({ text: `✓ Набор чекпоинтов «Основа» создан (ID: ${checkpointId || 'успешно'})` })
    } catch (e) {
      console.error(e)
      setStatus({ text: `Ошибка создания чекпоинтов: ${formatError(e)}`, isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  const seedTestData = async () => {
    setIsLoading(true)
    setStatus({ text: 'Создание тестовых данных...' })
    const logs: string[] = []

    try {
      // 1. Компетенции и скилы
      let existingCompetencies: RoleTypeItem[] = []
      try {
        const { data } = await api.get<any>(ENDPOINTS.ROLE_TYPES)
        if (Array.isArray(data)) {
          existingCompetencies = data
        } else if (data && typeof data === 'object') {
          existingCompetencies = data.roleTypes || data.items || data.data || []
        }
      } catch (e) {
        console.warn('Не удалось получить компетенции:', e)
      }

      let createdCompCount = 0
      let createdSkillCount = 0
      const competencyMap: Record<string, string> = {}
      const skillMap: Record<string, string> = {}

      for (const comp of SEED_COMPETENCIES) {
        let roleTypeId = existingCompetencies.find(
          c => ((c.name || c.roleTypeName || '')).trim().toLowerCase() === comp.name.trim().toLowerCase()
        )?.id || existingCompetencies.find(
          c => ((c.name || c.roleTypeName || '')).trim().toLowerCase() === comp.name.trim().toLowerCase()
        )?.roleTypeId

        if (!roleTypeId) {
          try {
            const { data } = await api.post<any>(ENDPOINTS.ROLE_TYPES, {
              name: comp.name,
            })
            roleTypeId = data?.roleTypeId || data?.id
            if (roleTypeId) {
              createdCompCount++
              existingCompetencies.push({ id: roleTypeId, name: comp.name })
            }
          } catch (err) {
            console.warn(`Не удалось создать компетенцию ${comp.name}:`, formatError(err))
          }
        }

        if (roleTypeId) {
          competencyMap[comp.name.toLowerCase()] = roleTypeId
          for (const skillName of comp.skills) {
            try {
              const { data } = await api.post<any>(ENDPOINTS.SKILLS, { skillName, roleTypeId })
              createdSkillCount++
              const skillId = data?.skillId || data?.id
              if (skillId) {
                skillMap[skillName.toLowerCase()] = skillId
              }
            } catch (err) {
              // Игнорируем если уже существует
            }
          }
        }
      }
      logs.push(`✓ Компетенции (+${createdCompCount}) и скилы (+${createdSkillCount})`)

      // 2. Теги и группы тегов
      let existingGroups: TagGroupItem[] = []
      try {
        const { data } = await api.get<any>(ENDPOINTS.TAGS)
        if (Array.isArray(data)) {
          existingGroups = data
        }
      } catch (e) {
        console.warn('Не удалось получить теги:', e)
      }

      let targetGroupId = existingGroups[0]?.groupId

      if (!targetGroupId) {
        try {
          const { data } = await api.get<any>(ENDPOINTS.TAG_GROUPS)
          if (Array.isArray(data) && data[0]?.groupId) {
            targetGroupId = data[0].groupId
          }
        } catch (e) {
          console.warn('Не удалось получить группы тегов:', e)
        }
      }

      if (!targetGroupId) {
        try {
          const { data } = await api.post<any>(ENDPOINTS.TAG_GROUPS, {
            groupName: 'Направления',
          })
          targetGroupId = data?.groupId || data?.id
        } catch (err) {
          const msg = formatError(err)
          console.warn('Не удалось создать группу тегов:', msg, err)
          logs.push(`! Ошибка создания группы тегов: ${msg}`)
        }
      }

      const tagMap: Record<string, string> = {}
      if (targetGroupId) {
        const existingTags = new Set(
          existingGroups.flatMap(g => (g.tags || []).map(t => {
            if (t.tagName && t.tagId) tagMap[t.tagName.trim().toLowerCase()] = t.tagId
            return (t.tagName || '').trim().toLowerCase()
          }))
        )
        let createdTagsCount = 0
        const failedTags: string[] = []

        for (const tagName of TARGET_TAGS) {
          if (!existingTags.has(tagName.trim().toLowerCase())) {
            try {
              const { data } = await api.post<any>(ENDPOINTS.TAGS, { tagName, groupId: targetGroupId })
              createdTagsCount++
              const tagId = data?.tagId || data?.id
              if (tagId) tagMap[tagName.trim().toLowerCase()] = tagId
            } catch (err) {
              const msg = formatError(err)
              console.warn(`Не удалось создать тег ${tagName}:`, msg, err)
              failedTags.push(`${tagName} (${msg})`)
            }
          }
        }

        if (createdTagsCount > 0) {
          logs.push(`✓ Теги созданы: +${createdTagsCount}`)
        } else if (failedTags.length === 0) {
          logs.push('✓ Все теги уже присутствуют')
        }

        if (failedTags.length > 0) {
          logs.push(`! Ошибки создания тегов: ${failedTags.join(', ')}`)
        }
      } else {
        logs.push('! Не найдена группа для добавления тегов')
      }

      // 3. Платформы
      let existingPlatforms: any[] = []
      try {
        const { data } = await api.get<any>(ENDPOINTS.PLATFORMS)
        existingPlatforms = Array.isArray(data) ? data : []
      } catch (e) {
        console.warn('Не удалось получить платформы:', e)
      }

      const existingPlatformNames = new Set(
        existingPlatforms.flatMap((item: any) => {
          if (Array.isArray(item.platforms)) {
            return item.platforms.map((p: any) => (p.name || '').trim().toLowerCase())
          }
          if (item.name) {
            return [(item.name || '').trim().toLowerCase()]
          }
          return []
        })
      )
      let createdPlatformsCount = 0
      const failedPlatforms: string[] = []

      for (const item of SEED_PLATFORMS) {
        if (!existingPlatformNames.has(item.name.trim().toLowerCase())) {
          try {
            await api.post(ENDPOINTS.PLATFORMS, { name: item.name, category: item.category })
            createdPlatformsCount++
          } catch (err) {
            const msg = formatError(err)
            console.warn(`Не удалось создать платформу ${item.name}:`, msg, err)
            failedPlatforms.push(`${item.name} (${msg})`)
          }
        }
      }

      if (createdPlatformsCount > 0) {
        logs.push(`✓ Платформы созданы: +${createdPlatformsCount}`)
      } else if (failedPlatforms.length === 0) {
        logs.push('✓ Все платформы уже созданы')
      }

      if (failedPlatforms.length > 0) {
        logs.push(`! Ошибки создания платформ: ${failedPlatforms.join(', ')}`)
      }

      // 4. Партнеры
      let existingPartners: any[] = []
      try {
        const { data } = await api.get<any>(ENDPOINTS.PARTNERS)
        if (Array.isArray(data)) {
          existingPartners = data
        } else if (data?.partners && Array.isArray(data.partners)) {
          existingPartners = data.partners
        }
      } catch (e) {
        console.warn('Не удалось получить партнеров:', e)
      }

      const partnerMap: Record<string, string> = {}
      for (const p of existingPartners) {
        const pId = p.projectPartnerId || p.partnerId || p.id
        const pName = p.name || ''
        if (pId && pName) partnerMap[pName.trim().toLowerCase()] = pId
      }

      let createdPartnersCount = 0
      for (const partner of SEED_PARTNERS) {
        if (!partnerMap[partner.name.trim().toLowerCase()]) {
          try {
            const { data } = await api.post<any>(ENDPOINTS.PARTNERS, {
              name: partner.name,
              profilePicture: '',
            })
            const partnerId = data?.partnerId || data?.projectPartnerId || data?.id
            if (partnerId) {
              partnerMap[partner.name.trim().toLowerCase()] = partnerId
              createdPartnersCount++
            }
          } catch (err) {
            console.warn(`Не удалось создать партнера ${partner.name}:`, formatError(err))
          }
        }
      }
      if (createdPartnersCount > 0) {
        logs.push(`✓ Партнеры созданы: +${createdPartnersCount}`)
      } else {
        logs.push('✓ Партнеры уже присутствуют')
      }

      // 5. Чекпоинты
      let checkpointId = ''
      try {
        const { data } = await api.get<any>(`${ENDPOINTS.CHECKPOINTS}?offset=0&limit=10`)
        const cpList = Array.isArray(data) ? data : (data?.checkpoints || [])
        if (cpList.length > 0) {
          checkpointId = cpList[0].id || cpList[0].checkpointId || ''
        }
      } catch (e) {
        console.warn('Не удалось получить чекпоинты:', e)
      }

      if (!checkpointId) {
        try {
          const { data } = await api.post<any>(ENDPOINTS.CHECKPOINTS, {
            name: 'Основа',
            title: 'Основа',
            checkpoints: [
              { title: 'Старт набора', deadline: '2026-09-19' },
              { title: 'Донабор', deadline: '2026-10-08' },
              { title: 'Защита проекта', deadline: '2027-01-21' },
            ],
          })
          checkpointId = data?.checkpointId || data?.id || ''
          if (checkpointId) logs.push('✓ Набор чекпоинтов «Основа» создан')
        } catch (err) {
          console.warn('Не удалось создать чекпоинты:', formatError(err))
        }
      }

      // 6. Проекты (если проектов нет или мало)
      let existingProjectsCount = 0
      try {
        const { data } = await api.get<any>(`${ENDPOINTS.PROJECTS}?limit=5`)
        existingProjectsCount = data?.total ?? (Array.isArray(data?.projects) ? data.projects.length : 0)
      } catch (e) {
        console.warn('Не удалось получить проекты:', e)
      }

      if (existingProjectsCount === 0 && checkpointId) {
        const defaultPartnerId = Object.values(partnerMap)[0]
        const webTagId = tagMap['веб-разработка'] || Object.values(tagMap)[0]
        const mobileTagId = tagMap['мобайл-разработка'] || Object.values(tagMap)[1] || webTagId
        const vrTagId = tagMap['vr/ar'] || Object.values(tagMap)[2] || webTagId

        const frontendRoleId = competencyMap['frontend'] || Object.values(competencyMap)[0]
        const backendRoleId = competencyMap['backend'] || Object.values(competencyMap)[1] || frontendRoleId
        const mobileRoleId = competencyMap['mobile'] || Object.values(competencyMap)[2] || frontendRoleId
        const qaRoleId = competencyMap['qa'] || Object.values(competencyMap)[3] || frontendRoleId
        const designerRoleId = competencyMap['дизайнер'] || Object.values(competencyMap)[4] || frontendRoleId

        if (defaultPartnerId && webTagId && frontendRoleId) {
          const sampleProjects = [
            {
              type: 'Case',
              partnerId: partnerMap['газпром нефть'] || defaultPartnerId,
              primaryTagId: webTagId,
              tagIds: [webTagId],
              checkpoints: checkpointId,
              meta: {
                title: 'Автоматизация составления графиков учета рабочего времени вахтового персонала',
                description: 'Разработка интеллектуального сервиса для автоматического построения графиков с учетом квалификации и ограничений.',
              },
              roles: [
                { roleTypeId: frontendRoleId, placesCount: 2, minPlacesCount: 1 },
                { roleTypeId: backendRoleId, placesCount: 2, minPlacesCount: 1 },
                { roleTypeId: qaRoleId, placesCount: 1, minPlacesCount: 1 },
              ],
              prdMeta: {
                prerequisites: 'Знание React / Node.js',
                projectGoal: 'Ускорить формирование графиков вахты в 5 раз',
                problemStatement: 'Ручное составление расписаний занимает до 3 дней и содержит ошибки',
                audience: [
                  { title: 'HR-менеджеры', description: 'Специалисты по планированию персонала', minAge: 22, maxAge: 65 }
                ],
                functional: ['Построение графика', 'Учет переработок', 'Экспорт в Excel']
              }
            },
            {
              type: 'Case',
              partnerId: partnerMap['т-банк'] || defaultPartnerId,
              primaryTagId: mobileTagId,
              tagIds: [mobileTagId],
              checkpoints: checkpointId,
              meta: {
                title: 'Мобильное приложение для учета личных финансов и инвестиций',
                description: 'Кроссплатформенное приложение с геймификацией накоплений и рекомендательной системой.',
              },
              roles: [
                { roleTypeId: mobileRoleId, placesCount: 2, minPlacesCount: 1 },
                { roleTypeId: backendRoleId, placesCount: 1, minPlacesCount: 1 },
                { roleTypeId: designerRoleId, placesCount: 1, minPlacesCount: 1 },
              ],
              prdMeta: {
                prerequisites: 'Опыт Flutter или React Native',
                projectGoal: 'Создать интуитивное приложение для ведения бюджета',
                problemStatement: 'Сложные банковские приложения отпугивают молодых пользователей',
                audience: [
                  { title: 'Студенты и молодежь', description: 'Пользователи 18-30 лет', minAge: 18, maxAge: 35 }
                ],
                functional: ['Учет расходов', 'Постановка финансовых целей', 'Калькулятор сложного процента']
              }
            },
            {
              type: 'Study',
              partnerId: partnerMap['яндекс'] || defaultPartnerId,
              primaryTagId: vrTagId,
              tagIds: [vrTagId],
              checkpoints: checkpointId,
              meta: {
                title: 'Интерактивная AR-навигация по учебным корпусам университета',
                description: 'Навигационная AR-система для студентов и гостей университета с подсказками в реальном времени.',
              },
              roles: [
                { roleTypeId: mobileRoleId, placesCount: 2, minPlacesCount: 1 },
                { roleTypeId: designerRoleId, placesCount: 1, minPlacesCount: 1 },
                { roleTypeId: qaRoleId, placesCount: 1, minPlacesCount: 1 },
              ],
              prdMeta: {
                prerequisites: 'Базовые знания Unity или мобильной разработки',
                projectGoal: 'Помочь первокурсникам и гостям ориентироваться в кампусе',
                keyFunctionality: ['Построение маршрута до аудитории', 'AR-стрелки на экране', 'Поиск расписания']
              }
            }
          ]

          let createdProjectsCount = 0
          for (const proj of sampleProjects) {
            try {
              await api.post(ENDPOINTS.PROJECTS, proj)
              createdProjectsCount++
            } catch (err) {
              console.warn('Не удалось создать проект:', formatError(err))
            }
          }
          if (createdProjectsCount > 0) {
            logs.push(`✓ Тестовые проекты созданы: +${createdProjectsCount}`)
          }
        }
      }

      // Инвалидация всех запросов для мгновенного обновления интерфейса
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ['competencies'] }),
        queryClient.invalidateQueries({ queryKey: ['skills'] }),
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
        queryClient.invalidateQueries({ queryKey: ['tag-groups'] }),
        queryClient.invalidateQueries({ queryKey: ['platforms'] }),
        queryClient.invalidateQueries({ queryKey: ['partners'] }),
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
        queryClient.invalidateQueries({ queryKey: ['checkpoints'] }),
      ])

      setStatus({ text: logs.join('\n') })
    } catch (e) {
      console.error(e)
      setStatus({ text: `Ошибка: ${formatError(e)}`, isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.containerList}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>Тестовое меню</span>
          <span className={styles.badge}>Dev</span>
        </div>
        <button
          className={styles.toggleBtn}
          onClick={() => setIsOpen(prev => !prev)}
          title={isOpen ? 'Свернуть' : 'Развернуть'}
        >
          {isOpen ? '▲' : '▼'}
        </button>
      </div>

      {isOpen && (
        <div className={styles.actions}>
          <button
            className={styles.seedButton}
            onClick={seedTestData}
            disabled={isLoading}
          >
            {isLoading ? 'Создание...' : 'Создать тестовые данные'}
          </button>

          <button
            className={styles.seedButton}
            onClick={createBaseCheckpoints}
            disabled={isLoading}
          >
            {isLoading ? 'Создание...' : 'Создать чекпоинты «Основа»'}
          </button>

          <button
            className={styles.clearButton}
            onClick={clearProfileData}
            disabled={isLoading}
          >
            Очистить данные профиля
          </button>

          {status && (
            <div
              className={`${styles.statusMessage} ${status.isError ? styles.statusError : styles.statusSuccess
                }`}
            >
              {status.text}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
