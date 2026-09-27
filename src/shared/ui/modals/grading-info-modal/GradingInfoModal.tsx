import clsx from 'clsx';
import { Modal } from '@/shared/ui/modals/modal/Modal.tsx';
import { GreyButton } from '@/shared/ui/elements/buttons';
import styles from './GradingInfoModal.module.css';

export interface GradingInfoModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const GradingInfoModal = ({ isOpen = true, onClose }: GradingInfoModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Body>
        <div className={styles.container}>
          <h2 className={styles.mainTitle}>Оценивание работы участников</h2>
          <p className={styles.leadText}>
            Регулярная оценка студентов — ключевой этап проектной работы, который напрямую влияет на итоговый успех всего проекта.
          </p>

          <div className={styles.sections}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Что именно оценивать?</h3>
              <p className={styles.sectionText}>
                Ваша задача — оценивать фактическое количество часов, которое участник посвятил работе над проектом в течение каждой недели. Выставлять часы необходимо во вкладке <span className={styles.tabLink}>Оценка участников</span>.
              </p>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Как работают дедлайны оценивания?</h3>
              <p className={styles.sectionText}>
                Весь рабочий процесс разбит на Спринты, состоящие из 2 недель. В идеале вносить оценки нужно еженедельно, чтобы прозрачно отслеживать динамику команды. Однако вы можете выставить часы за обе недели и в самом конце спринта.{' '}
                <span className={styles.greenHighlight}>
                  Главное правило — оценивание должно быть полностью выполнено до завершения текущего спринта.
                </span>
              </p>
            </div>

            <div className={styles.section}>
              <h3 className={clsx(styles.sectionTitle, styles.warningTitle)}>Если не закрыть Спринт?</h3>
              <p className={styles.sectionText}>
                Если вы не успеете проставить баллы за Спринт, <span className={styles.blackText}>оценивание проекта будет автоматически заблокировано системой.</span> {' '}
                Для восстановления доступа потребуется написать объяснительную, указав причину задержки. После её рассмотрения администратор сможет разблокировать доступ.
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className={styles.footer}>
          <GreyButton
            onClick={onClose}
            textButton="Понятно"
            className={styles.closeBtn}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};
