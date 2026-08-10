import styles from './AllInfoFields.module.css'
import PencilIcon from '@/shared/ui/icons/pencil.svg?react'
import React from "react";

interface BigBlockProps {
  bigTitle: string,
  children?: React.ReactNode
}

export const BigBlock = ({bigTitle, children}: BigBlockProps) => {
  return (
    <section className={styles.mainBody}>
      <p className={styles.bigTitle}>
        {bigTitle}
      </p>
      <div className={styles.bigContainer}>
        {children}
      </div>
    </section>
  )
}

interface SmallBlockProps {
  title?: string,
  subtitle?: string,
  onEditField?: () => void,
  children?: React.ReactNode,
}

export const SmallBlock = ({title, subtitle, onEditField, children}: SmallBlockProps) => {
  return (
    <div className={styles.smallContainer}>
      <div className={styles.header}>
        <p className={styles.title}>
          {title}
        </p>
        {
          !subtitle ? <button className={styles.editButton} onClick={onEditField}>
            <PencilIcon className={styles.pencilIcon}/>
          </button> : ''
        }
      </div>
      {children ? children : null}
    </div>
  )
}

interface SmallBlockBodyProps {
  subtitle?: string,
  mainText?: string,
  onEditField?: () => void,
  children?: React.ReactNode,
}

export const SmallBlockBody = ({subtitle, mainText, children, onEditField} :SmallBlockBodyProps) => {
  return(
    <div className={styles.body}>
      {
        subtitle && <div className={styles.header}>
          <p className={styles.subtitle}>
            {subtitle}
          </p>
          <button className={styles.editButton} onClick={onEditField}>
            <PencilIcon className={styles.pencilIcon}/>
          </button>
        </div>
      }
      {
        mainText && <p className={styles.mainText}>
          {mainText}
        </p>
      }
      {children ? children : null}
    </div>
  )
}

interface TagProps {
  title: string
}

export const Tag = ({title}: TagProps) => {
  return (
    <div className={styles.tag}>
      {title}
    </div>
  )
}

export const Separator = () => {
  return (
    <div className={styles.separator}/>
  )
}

interface AllListProps {
  list: string[]
}

export const AllList = ({list}: AllListProps) => {
  return (
    <div className={styles.allList}>
      {
        list.map((piece: string, index: number) => (
          <div key={piece} className={styles.piece}>
            <p>
              {index + 1}.
            </p>
            <p>
              {piece}
            </p>
          </div>
        ))
      }
    </div>
  )
}
