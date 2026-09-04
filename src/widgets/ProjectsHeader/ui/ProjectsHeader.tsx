import { InfoTooltip, Pagination, PopupMenu } from '@/shared/ui'
import styles from './ProjectsHeader.module.css'
import { MagicToggle } from '@/shared/ui/magic-checkbox/MagicToggle'
import { useFilterStore } from '@/features/filter/model/useFilterStore'
import type { SortKey } from '@/features/filter/model/types'
import { getProjectPlural, useProjects } from '@/entities/project'
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared";
import { useAuthStore, useIsProfileFilled } from "@/entities/user";

const SORT_OPTIONS: { key: Exclude<SortKey, 'relevance'>; label: string }[] = [
  { key: 'created_desc', label: 'Новые' },
  { key: 'created_asc', label: 'Старые' }
]

export function ProjectsHeader() {
  const { isSkillsFilled } = useIsProfileFilled()
  const status = useAuthStore(state => state.status)
  const navigate = useNavigate()
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
                    onClickGreenButtonText={() => { navigate(ROUTES.PROFILE.BASE) }}
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

            Наиболее подходящие
          </div>
          <div className={styles.navEl}>|</div>
          <div className={`${styles.navEl} ${isRelevanceSort ? styles.disabled : ''}`}>
            <PopupMenu trigger={
              <div className={styles.sortTrigger}>
                {currentSort?.label}
              </div>
            }
              popupClassName={styles.popup}
            >
              {SORT_OPTIONS.map(o => (
                <PopupMenu.Row
                  key={o.key}
                  title={o.label}
                  isActive={o.key === sort}
                  onClick={() => setSort(o.key)}
                />
              ))}
            </PopupMenu>
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
