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
}

interface RoleTypeItem {
  id: string
  name: string
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

interface PlatformGroupItem {
  category: string
  platforms: {
    platformId: string
    name: string
    category: string
  }[]
}

const SEED_COMPETENCIES = [
  {
    name: 'Frontend-разработчик',
    skills: ['React', 'TypeScript', 'HTML/CSS'],
  },
  {
    name: 'Backend-разработчик',
    skills: ['Node.js', 'PostgreSQL', 'Golang'],
  },
  {
    name: 'Мобильный разработчик',
    skills: ['Flutter', 'React Native'],
  },
  {
    name: 'UI/UX Дизайнер',
    skills: ['Figma', 'UI/UX дизайн'],
  },
  {
    name: 'QA-инженер',
    skills: ['Ручное тестирование', 'Автотесты'],
  },
]

const TARGET_TAGS = ['Веб-разработка', 'Инженерия', 'Мобайл-разработка', 'VR/AR']

const SEED_PLATFORMS = [
  { name: 'GitHub', category: 'Repository' },
  { name: 'GitLab', category: 'Repository' },
  { name: 'Jira', category: 'TaskTracker' },
  { name: 'YouTrack', category: 'TaskTracker' },
  { name: 'Figma', category: 'OtherPlatforms' },
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
      setStatus({ text: 'Ошибка очистки профиля', isError: true })
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
        const { data } = await api.get<RoleTypeItem[]>(ENDPOINTS.ROLE_TYPES)
        existingCompetencies = Array.isArray(data) ? data : []
      } catch (e) {
        console.warn('Не удалось получить компетенции:', e)
      }

      let createdCompCount = 0
      let createdSkillCount = 0

      for (const comp of SEED_COMPETENCIES) {
        let roleTypeId = existingCompetencies.find(
          c => c.name.trim().toLowerCase() === comp.name.trim().toLowerCase()
        )?.id

        if (!roleTypeId) {
          try {
            const { data } = await api.post<{ roleTypeId: string }>(ENDPOINTS.ROLE_TYPES, {
              name: comp.name,
            })
            roleTypeId = data.roleTypeId
            createdCompCount++
          } catch (err) {
            console.warn(`Не удалось создать компетенцию ${comp.name}:`, err)
          }
        }

        if (roleTypeId) {
          for (const skillName of comp.skills) {
            try {
              await api.post(ENDPOINTS.SKILLS, { skillName, roleTypeId })
              createdSkillCount++
            } catch (err) {
              console.warn(`Не удалось создать скилл ${skillName}:`, err)
            }
          }
        }
      }
      logs.push(`✓ Компетенции (+${createdCompCount}) и скилы (+${createdSkillCount})`)

      // 2. Теги: Веб-разработка, Инженерия, Мобайл-разработка, VR/AR
      let existingGroups: TagGroupItem[] = []
      try {
        const { data } = await api.get<TagGroupItem[]>(ENDPOINTS.TAGS)
        existingGroups = Array.isArray(data) ? data : []
      } catch (e) {
        console.warn('Не удалось получить теги:', e)
      }

      let targetGroupId = existingGroups[0]?.groupId

      if (!targetGroupId) {
        try {
          const { data } = await api.get<{ groupId: string; groupName: string }[]>(
            ENDPOINTS.TAG_GROUPS
          )
          if (Array.isArray(data) && data[0]?.groupId) {
            targetGroupId = data[0].groupId
          }
        } catch (e) {
          console.warn('Не удалось получить группы тегов:', e)
        }
      }

      if (!targetGroupId) {
        try {
          const { data } = await api.post<{ groupId: string }>(ENDPOINTS.TAG_GROUPS, {
            groupName: 'Направления',
          })
          targetGroupId = data.groupId
        } catch (err) {
          const msg = formatError(err)
          console.warn('Не удалось создать группу тегов:', msg, err)
          logs.push(`! Ошибка создания группы тегов: ${msg}`)
        }
      }

      if (targetGroupId) {
        const existingTags = new Set(
          existingGroups.flatMap(g => (g.tags || []).map(t => t.tagName.trim().toLowerCase()))
        )
        let createdTagsCount = 0
        const failedTags: string[] = []

        for (const tagName of TARGET_TAGS) {
          if (!existingTags.has(tagName.trim().toLowerCase())) {
            try {
              await api.post(ENDPOINTS.TAGS, { tagName, groupId: targetGroupId })
              createdTagsCount++
            } catch (err) {
              const msg = formatError(err)
              console.warn(`Не удалось создать тег ${tagName}:`, msg, err)
              failedTags.push(`${tagName} (${msg})`)
            }
          }
        }

        if (createdTagsCount > 0) {
          logs.push(`✓ Теги созданы: +${createdTagsCount} в группу`)
        } else if (failedTags.length === 0) {
          logs.push('✓ Все теги уже присутствуют')
        }

        if (failedTags.length > 0) {
          logs.push(`! Ошибки создания тегов: ${failedTags.join(', ')}`)
        }
      } else {
        logs.push('! Не найдена группа для добавления тегов')
      }

      // 3. Платформы: Гит (GitHub, GitLab), Таск-трекеры (Jira, YouTrack), Дизайн-среда (Figma)
      let existingPlatforms: PlatformGroupItem[] = []
      try {
        const { data } = await api.get<PlatformGroupItem[]>(ENDPOINTS.PLATFORMS)
        existingPlatforms = Array.isArray(data) ? data : []
      } catch (e) {
        console.warn('Не удалось получить платформы:', e)
      }

      const existingPlatformNames = new Set(
        existingPlatforms.flatMap(g => (g.platforms || []).map(p => p.name.trim().toLowerCase()))
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
        logs.push(`✓ Платформы созданы: +${createdPlatformsCount} (GitHub, GitLab, Jira, YouTrack, Figma)`)
      } else if (failedPlatforms.length === 0) {
        logs.push('✓ Все платформы уже созданы')
      }

      if (failedPlatforms.length > 0) {
        logs.push(`! Ошибки создания платформ: ${failedPlatforms.join(', ')}`)
      }

      // Инвалидация запросов для мгновенного обновления интерфейса
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ['competencies'] }),
        queryClient.invalidateQueries({ queryKey: ['skills'] }),
        queryClient.invalidateQueries({ queryKey: ['tags'] }),
        queryClient.invalidateQueries({ queryKey: ['platforms'] }),
      ])

      setStatus({ text: logs.join('\n') })
    } catch (e) {
      console.error(e)
      setStatus({ text: `Ошибка: ${String(e)}`, isError: true })
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
            className={styles.clearButton}
            onClick={clearProfileData}
            disabled={isLoading}
          >
            Очистить данные профиля
          </button>

          {status && (
            <div
              className={`${styles.statusMessage} ${
                status.isError ? styles.statusError : styles.statusSuccess
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
