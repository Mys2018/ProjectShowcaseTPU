import { useState } from 'react'
import styles from './RejectProjectButton.module.css'
import { useRejectProject } from '../api/mutations'
import { ConfirmModal, CrossIcon } from '@/shared'

interface RejectProjectButtonProps {
  projectId: string
}

export function RejectProjectButton({ projectId }: RejectProjectButtonProps) {
  const { mutate: rejectProject } = useRejectProject()
  const [isModalOpen, setIsModalOpen] = useState(false)
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
        onConfirm={() => rejectProject(projectId, { onSuccess: () => setIsModalOpen(false) })}
        onDecline={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className={styles.footer}>
          <span className={styles.divider} />
          <p className={styles.tip}>
            Проект не нарушает правила, но содержит ошибки? Лучше отправьте его на доработку
          </p>
        </div>
      </ConfirmModal>
    </>
  )
}
