import type { ReactNode } from 'react'
import styles from './CompetencyCard.module.css'

interface CompetencyCardProps {
  index: number
  name: string
  isRequired: boolean
  occurrenceIndex: number
  skillsContent: ReactNode
  requestContent: ReactNode
  headerActions?: ReactNode
}

export const CompetencyCard = ({
  index,
  name,
  isRequired,
  occurrenceIndex,
  skillsContent,
  requestContent,
  headerActions,
}: CompetencyCardProps) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardHeader}>
        <div className={styles.titleContainer}>
          <h4 className={styles.cardTitle}>
            {index + 1}. {name}
          </h4>
          {isRequired && <p className={styles.required}>*</p>}
          {occurrenceIndex !== 1 && (
            <p className={styles.occurrenceIndex}>({occurrenceIndex})</p>
          )}
        </div>
        {headerActions && <div>{headerActions}</div>}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.skillsBlock}>
          <div className={styles.mainContainer}>
            <span className={styles.skillsLabel}>Требуемые навыки</span>
            {skillsContent}
          </div>
        </div>

        <div className={styles.requestBlock}>
          <div className={styles.innerContainer}>
            {requestContent}
          </div>
        </div>
      </div>
    </div>
  )
}
