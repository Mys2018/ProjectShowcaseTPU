import { useCallback, useState } from 'react'
import styles from './RequestChangesProjectButton.module.css'
import { useSetProjectStatus } from '@/entities/project'
import { BigTextField, FilledButton, Modal, OutlineButton } from '@/shared'

interface RequestChangesProjectButtonProps {
  projectId: string
}

export function RequestChangesProjectButton({ projectId }: RequestChangesProjectButtonProps) {
  const { mutate: setProjectStatus, isPending } = useSetProjectStatus()
  const [comment, setComment] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const requestChanges = useCallback(
    (comment: string) =>
      setProjectStatus(
        { projectId, status: 'NeedsRework', comment },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setComment('')
          }
        }
      ),
    [setProjectStatus, projectId]
  )

  return (
    <>
      <OutlineButton className={styles.button} onClick={() => setIsModalOpen(true)} textButton='Отправить на доработку' />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.info}>
          <h2 className={styles.title}>Комментарий к доработке</h2>
          <p className={styles.description}>
            Наставник увидит комментарий и отправит проект на повторную проверку после внесения корректировок.
          </p>
        </div>
        <BigTextField
          placeholder='Замечания по оформлению и другие корректировки'
          maxLength={1500}
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={() => setIsModalOpen(false)}>
            Отмена
          </button>
          <FilledButton
            textButton='Отправить на доработку'
            disabled={comment.trim().length === 0 || isPending}
            onClick={() => requestChanges(comment)}
          />
        </div>
      </Modal>
    </>
  )
}
