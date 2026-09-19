import clsx from 'clsx'
import styles from '../ProjectInfo.module.css'
import s from './ProjectPrd.module.css'
import type { ProjectCardData } from '../../../model/types'
import { Section } from '@/shared'

interface ProjectPrdProps {
  prd: ProjectCardData['prdMeta']
  className?: string
}

export function ProjectPrd({ prd, className }: ProjectPrdProps) {
  const {
    prerequisites,
    productVision,
    audience,
    keyFunctionality,
    functional,
    nonFunctional,
    problemStatement,
    businessMetrics,
    projectPlan
  } = prd

  const requirements: { data: string[]; label: string }[] = [
    { data: keyFunctionality ?? [], label: 'Ключевой функционал' },
    { data: functional ?? [], label: 'Функциональные требования' },
    { data: nonFunctional ?? [], label: 'Нефункциональные требования' }
  ].filter(requirement => requirement.data.length)

  return (
    <div className={clsx(styles.wrapper, className)}>
      <h2 className={styles.title}>Требования к продукту (PRD)</h2>
      <Section className={s.container}>
        {(prerequisites || productVision) && (
          <div className={s.grid}>
            {prerequisites && (
              <div className={styles.block}>
                <h3 className={styles.heading}>Предпосылки</h3>
                <p className={styles.label}>{prerequisites}</p>
              </div>
            )}
            {productVision && (
              <div className={styles.block}>
                <h3 className={styles.heading}>Product vision</h3>
                <p className={styles.label}>{productVision}</p>
              </div>
            )}
          </div>
        )}
        {audience?.length && (
          <div className={clsx(styles.block, s.block)}>
            <h3 className={styles.heading}>Целевая аудитория</h3>
            <div className={s.grid}>
              {audience?.map((segment, index) => (
                <div className={styles.block} key={segment.title}>
                  <h4 className={s.heading}>Сегмент {index + 1}</h4>
                  <p className={s.label}>{segment.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {requirements.length && (
          <div className={clsx(styles.block, s.block)}>
            <h3 className={styles.heading}>Требования</h3>
            <div className={s.grid}>
              {requirements.map(requirement => (
                <div key={requirement.label} className={s.paragraph}>
                  <h4 className={s.heading}>{requirement.label}</h4>
                  <div className={styles.block}>
                    {requirement.data.map((item, index) => (
                      <p className={s.label} key={item}>
                        {index + 1}. {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {(problemStatement || businessMetrics) && (
          <div className={clsx(styles.block, s.block)}>
            <h3 className={styles.heading}>Реализация</h3>
            <div className={s.grid}>
              {problemStatement && (
                <div className={styles.block}>
                  <h4 className={s.heading}>Постановка задачи</h4>
                  <p className={styles.label}>{problemStatement}</p>
                </div>
              )}
              {businessMetrics?.length && (
                <div className={s.paragraph}>
                  <h4 className={s.heading}>Бизнес-метрики</h4>
                  <div className={styles.block}>
                    {businessMetrics.map((item, index) => (
                      <p className={s.label} key={item}>
                        {index + 1}. {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {projectPlan?.length && (
          <div className={styles.block}>
            <h3 className={styles.heading}>План проекта</h3>
            <div className={styles.block}>
              {projectPlan.map((item, index) => (
                <p key={item} className={s.label}>
                  {index + 1}. {item}
                </p>
              ))}
            </div>
          </div>
        )}
      </Section>
    </div>
  )
}
