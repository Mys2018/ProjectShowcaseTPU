import styles from './EmptyBlanking.module.css'

interface EmptyBlankingProps {
  text: string,
}

export const EmptyBlanking = ({text}: EmptyBlankingProps) => {
  return (
    <div className={styles.emptyMain}>
      <p>{text}</p>
    </div>
  )
}
