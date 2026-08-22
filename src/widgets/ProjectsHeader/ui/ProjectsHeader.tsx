import { useState, useRef, useEffect } from 'react'
import { InfoTooltip, Pagination } from '@/shared/ui'
import styles from './ProjectsHeader.module.css'
import { MagicToggle } from '@/shared/ui/magic-checkbox/MagicToggle'
import { useFilterStore } from '@/features/filter/model/useFilterStore'
import type { SortKey } from '@/features/filter/model/types'
import { getProjectPlural, useProjects } from '@/entities/project'
import { useIsProfileFilled } from "@/entities/user/lib";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared";
import { useAuthStore } from "@/entities/user";

const SORT_OPTIONS: { key: Exclude<SortKey, 'relevance'>; label: string }[] = [
  { key: 'created_desc', label: 'Новые' },
  { key: 'created_asc', label: 'Старые' }
]

export function ProjectsHeader() {
  const [sortOpen, setSortOpen] = useState(false)
  const { isSkillsFilled } = useIsProfileFilled()
  const status = useAuthStore(state => state.status)
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { tags, competencies, projectTypes, sort, setSort, isRelevanceSort, query, limit, page, setPage } = useFilterStore()
  const { data } = useProjects({
    q: query,
    projectType: Array.from(projectTypes),
    tagId: Array.from(tags),
    roleTypeId: Array.from(competencies),
    sort: isRelevanceSort ? 'relevance' : sort,
    limit: limit,
    offset: (page - 1) * limit
  })
  const { total } = data || { total: null }

  const currentSort = SORT_OPTIONS.find(o => o.key === sort)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const downArrow = (
    <svg
      width='10'
      height='8'
      viewBox='0 0 10 8'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={`${styles.arrow} ${sortOpen ? styles.arrowUp : ''}`}
    >
      <path d='M1 3.5L5 7.5L9 3.5' stroke='#323541' strokeOpacity='0.6' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )

  return (
    <header className={styles.projectsHeader}>
      <div className={styles.topPart}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Набор на проекты</h1>
          {total ? <h2 className={styles.subTitle}>{getProjectPlural(total)}</h2> : ''}

        </div>
        <nav className={styles.navPart}>
          <div className={styles.navEl}>
            {
              status === 'authenticated' ? (
                isSkillsFilled ?
                  <>
                    <MagicToggle />
                  </> :
                  <InfoTooltip
                    title='Заполните ключевые навыки'
                    body={[
                      {
                        text: ['Чтобы мы могли отображать подходящие тебе проекты,  необходимо заполнить хотя бы 1 компетенцию с навыками']
                      }
                    ]}
                    size={'small'}
                    pointer={'topRight'}
                    greenButtonText={'Перейти к заполнению'}
                    onClickGreenButtonText={() => { navigate(`/${ROUTES.MY_PROFILE}`) }}
                  >
                    <MagicToggle disabled={true} />
                  </InfoTooltip>
              )
                :
                <InfoTooltip
                  body={[
                    {
                      text: ['Функция доступна только для зарегистрированных пользователей']
                    }
                  ]}
                  size={'small'}
                  pointer={'topRight'}
                  greenButtonText={'Войти в аккаунт'}
                  onClickGreenButtonText={() => { navigate(ROUTES.LOGIN) }}
                >
                  <MagicToggle disabled={true} />
                </InfoTooltip>

            }

            наиболее подходящие
          </div>
          <div className={`${styles.navEl} ${isRelevanceSort ? styles.disabled : ''}`} ref={dropdownRef}>
            <div className={styles.sortTrigger} onClick={() => setSortOpen(v => !v)}>
              {currentSort?.label} {downArrow}
            </div>
            {sortOpen && (
              <div className={styles.dropdown}>
                {SORT_OPTIONS.map(o => (
                  <div
                    key={o.key}
                    className={`${styles.dropdownItem} ${o.key === sort ? styles.dropdownItemActive : ''}`}
                    onClick={() => {
                      setSort(o.key)
                      setSortOpen(false)
                    }}
                  >
                    {o.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.navEl}>|</div>
          <div>
            <Pagination currentPage={page} onPageSelect={setPage} totalPages={total ? Math.ceil(total / limit) || 1 : 1} />
          </div>
        </nav>
      </div>
    </header>
  )
}
