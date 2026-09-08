import clsx from 'clsx'
import { useState } from 'react'
import styles from './CancelApplicationButton.module.css'
import { useCancelApplication } from '../api/mutations'
import { ConfirmModal } from '@/shared'

interface CancelApplicationButtonProps {
  applicationId: string
}

export function CancelApplicationButton({ applicationId }: CancelApplicationButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { mutate: cancelApplication, isPending } = useCancelApplication()

	const handleConfirm = () => {
		setIsConfirmOpen(false)
		cancelApplication(applicationId)
	}

  return (
    <>
      <button className={clsx(styles.button, isPending && styles.pending)} onClick={() => setIsConfirmOpen(true)} disabled={isPending}>
        Отменить заявку
      </button>
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title='Отменить заявку?'
        confirmText='Да'
        cancelText='Нет'
        onConfirm={handleConfirm}
        onDecline={() => setIsConfirmOpen(false)}
      />
    </>
  )
}
