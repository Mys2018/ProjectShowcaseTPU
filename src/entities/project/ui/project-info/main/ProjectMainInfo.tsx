import type { ReactElement } from 'react'
import styles from '../ProjectInfo.module.css'
import s from './ProjectMainInfo.module.css'
import type { ProjectCardData } from '../../../model/types'
import clsx from 'clsx'
import { Section } from '@/shared'

interface ProjectMainInfoProps {
  project: ProjectCardData
  primaryTagSlot?: ReactElement
  tagsSlot?: ReactElement
  className?: string
}

export function ProjectMainInfo({ project, primaryTagSlot, tagsSlot, className }: ProjectMainInfoProps) {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <h2 className={styles.title}>Основная информация</h2>
      <Section className={s.container}>
        <div className={clsx(styles.block, s.title)}>
          <h3 className={styles.heading}>Название проекта</h3>
          <p className={styles.label}>{project.meta.title}</p>
        </div>

        <div className={clsx(styles.block, s.partner)}>
          <h3 className={styles.heading}>Заказчик</h3>
          <p className={styles.label}>{project.partner.name}</p>
        </div>

        <div className={clsx(styles.block, s.description)}>
          <h3 className={styles.heading}>Описание</h3>
          <p className={styles.label}>{project.meta.description}</p>
        </div>

        {(primaryTagSlot || tagsSlot) && (
          <div className={clsx(styles.block, s.tags)}>
            <h3 className={styles.heading}>Трек теги</h3>
            <div className={s.list}>
              {primaryTagSlot && (
                <div className={s.tagBlock}>
                  <h4 className={s.heading}>Основной</h4>
                  {primaryTagSlot}
                </div>
              )}
              {tagsSlot && (
                <div className={s.tagBlock}>
                  <h4 className={s.heading}>Дополнительные</h4>
                  {tagsSlot}
                </div>
              )}
            </div>
          </div>
        )}
      </Section>
    </div>
  )
}
