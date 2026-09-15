import { type ReactNode, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from './CompetencyCard.module.css'

interface CompetencyCardProps {
  index: number
  name: string
  isRequired: boolean
  occurrenceIndex: number
  totalOccurrences?: number
  skillsContent: ReactNode
  requestContent: ReactNode
  headerActions?: ReactNode
  isCollapsed?: boolean
}

export const CompetencyCard = ({
  index,
  name,
  isRequired,
  occurrenceIndex,
  totalOccurrences,
  skillsContent,
  requestContent,
  headerActions,
  isCollapsed = false,
}: CompetencyCardProps) => {
  const skillsRef = useRef<HTMLDivElement>(null)
  const [skillsHeight, setSkillsHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    const el = skillsRef.current
    if (!el) return

    const updateHeight = () => {
      setSkillsHeight(el.offsetHeight)
    }

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const showOccurrence =
    totalOccurrences !== undefined ? totalOccurrences > 1 : occurrenceIndex !== 1

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardHeader}>
        <div className={styles.titleContainer}>
          <h4 className={styles.cardTitle}>
            {index + 1}. {name}
          </h4>
          {isRequired && <p className={styles.required}>*</p>}
          {showOccurrence && (
            <p className={styles.occurrenceIndex}>({occurrenceIndex})</p>
          )}
        </div>
        {headerActions && <div>{headerActions}</div>}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.skillsBlock} ref={skillsRef}>
          <div className={styles.mainContainer}>
            <span className={styles.skillsLabel}>Требуемые навыки</span>
            {skillsContent}
          </div>
        </div>

        <div
          className={clsx(styles.requestBlock, isCollapsed && styles.collapsed)}
          style={{
            height: isCollapsed && skillsHeight ? `${skillsHeight}px` : undefined,
          }}
        >
            {requestContent}
        </div>
      </div>
    </div>
  )
}
