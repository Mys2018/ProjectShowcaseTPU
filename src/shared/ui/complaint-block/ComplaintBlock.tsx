import styles from './ComplaintBlock.module.css'
import QuestionIcon from '@/shared/ui/icons/thin_question.svg?react'
import { useModalStore } from '@/shared/model'
import { useMe } from '@/entities/user'

interface ComplaintBlockProps {
  onClick?: () => void
}

export const ComplaintBlock = ({ onClick }: ComplaintBlockProps) => {
  const openModal = useModalStore((state) => state.openModal)
  const { data: me } = useMe()

  const handleClick = () => {
    onClick?.()
    openModal('COMPLAINT_MODAL', {
      targetUserId: me?.id ? Number(me.id) : undefined,
    })
  }

  return (
    <button className={styles.button} onClick={handleClick}>
      <QuestionIcon className={styles.icon} />
      <div>
        <p>Поможем решить проблему</p>
        <p>если вы с ней столкнулись</p>
      </div>
    </button>
  )
}
