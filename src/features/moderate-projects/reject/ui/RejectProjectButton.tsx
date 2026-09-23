import { useCallback, useState } from 'react'
import styles from './RejectProjectButton.module.css'
import { useSetProjectStatus } from '@/entities/project'
import { BigTextField, ConfirmModal, CrossIcon } from '@/shared'

interface RejectProjectButtonProps {
  projectId: string
}

export function RejectProjectButton({ projectId }: RejectProjectButtonProps) {
  const { mutate: setProjectStatus } = useSetProjectStatus()
  const rejectProject = useCallback(
    (comment: string) => setProjectStatus({ projectId, status: 'Rejected', comment }, { onSuccess: () => setIsModalOpen(false) }),
    [setProjectStatus, projectId]
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comment, setComment] = useState('')

  return (
    <>
      <button className={styles.button} onClick={() => setIsModalOpen(true)}>
        <CrossIcon className={styles.icon} />
        <p className={styles.label}>Отклонить проект полностью</p>
      </button>
      <ConfirmModal
        className={styles.modal}
        title='Вы уверены, что хотите отклонить проект?'
        description='Отклоняйте карточку только в случае откровенного спама, черновых записей или грубых нарушений регламента ТПУ.'
        confirmText='Отклонить проект'
        cancelText='Отмена'
        onConfirm={() => comment.trim() && rejectProject(comment)}
        onDecline={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mainSlot={
          <BigTextField
            placeholder='Нарушения правил и другие корректировки'
            maxLength={1500}
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        }
      >
        <div className={styles.footer}>
          <span className={styles.divider} />
          <p className={styles.tip}>Проект не нарушает правила, но содержит ошибки? Лучше отправьте его на доработку</p>
        </div>
      </ConfirmModal>
    </>
  )
}
