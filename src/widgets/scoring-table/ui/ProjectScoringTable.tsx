import styles from './ScoringTable.module.css'
import { ScoringTable } from './ScoringTable'
import { useProjectScoring } from '../model/useProjectScoring'

export function ProjectScoringTable({ projectId }: { projectId: string }) {
  const { data, isLoading, isError } = useProjectScoring(projectId)

  if (isLoading) return <p className={styles.state}>Загружаем часы…</p>
  if (isError || !data) return <p className={styles.state}>Не удалось загрузить часы</p>
  if (data.sprints.length === 0) return <p className={styles.state}>Спринтов пока нет</p>

  return <ScoringTable model={data} />
}
