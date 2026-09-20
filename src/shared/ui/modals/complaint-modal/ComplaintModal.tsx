import { useState } from 'react'
import styles from './ComplaintModal.module.css'
import TpuLogoDark from '@/shared/assets/tpu_logo.svg?react'
import { Modal } from '@/shared/ui/modals/modal/Modal.tsx'
import { FilledButton } from '@/shared/ui/elements/buttons'
import { BigTextField } from '@/shared/ui/fields/text-field/TextField.tsx'
import { useFileComplaint } from '@/entities/complaint'
import { useMe } from '@/entities/user'

export interface ComplaintModalProps {
  isOpen: boolean
  onClose: () => void
  targetUserId?: number
}

export const ComplaintModal = ({
  isOpen,
  onClose,
  targetUserId,
}: ComplaintModalProps) => {
  const [reason, setReason] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { data: me } = useMe()
  const { mutate: sendComplaint, isPending, error } = useFileComplaint()

  const handleClose = () => {
    setReason('')
    setIsSubmitted(false)
    onClose()
  }

  const handleSubmit = () => {
    const trimmed = reason.trim()
    if (!trimmed || isPending) return

    const currentUserId = targetUserId ?? (me?.id ? Number(me.id) : 0)

    sendComplaint(
      {
        targetUserId: currentUserId,
        reason: trimmed,
      },
      {
        onSuccess: () => {
          setIsSubmitted(true)
        },
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} variant="grey100">
        {isSubmitted ? (
          <div className={styles.successContainer}>
            <h3 className={styles.successTitle}>Обращение отправлено!</h3>
            <p className={styles.successDesc}>
              Спасибо за обратную связь. Мы изучим вашу проблему и свяжемся с вами при необходимости.
            </p>
            <FilledButton textButton="Понятно" onClick={handleClose} />
          </div>
        ) : (
          <>
            <Modal.Header title={'Столкнулись с проблемой?'}/>

            <div className={styles.body}>
              <BigTextField
                className={styles.textArea}
                value={reason}
                placeholder="Опишите свою проблему"
                maxLength={1500}
                onChange={(e) => setReason(e.target.value)}
              />
              {error && (
                <p className={styles.errorText}>
                  Не удалось отправить обращение. Пожалуйста, попробуйте позже.
                </p>
              )}
            </div>

            <Modal.Footer>
              <div className={styles.footer}>
                <div className={styles.contacts}>
                  <span className={styles.contactsLabel}>Контакты тех. поддержки</span>
                  <a href="mailto:support@tpu.ru" className={styles.contactsEmail}>
                    support@tpu.ru
                  </a>
                </div>

                <div className={styles.actions}>
                  <TpuLogoDark/>
                  <FilledButton
                    textButton={isPending ? 'Отправка...' : 'Отправить'}
                    onClick={handleSubmit}
                    disabled={!reason.trim() || isPending}
                    className={styles.submitButton}
                  />
                </div>
              </div>
            </Modal.Footer>
          </>
        )}
    </Modal>
  )
}
