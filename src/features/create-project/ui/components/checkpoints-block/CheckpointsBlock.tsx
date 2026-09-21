import clsx from "clsx";
import styles from './CheckpointsBlock.module.css'
import {PlusButton} from "@/shared/ui/elements/buttons/plus-button/PlusButton.tsx";
import EditIcon from '@/shared/ui/icons/pencil.svg?react';
import TrashIcon from '@/shared/ui/icons/trash.svg?react';
import { mapDateToLocalString, parseDeadline } from "@/shared";

const displayDeadline = (deadline: string) => {
  if (!deadline) return '';
  const parsed = parseDeadline(deadline);
  if (parsed && !isNaN(parsed.getTime())) {
    return mapDateToLocalString(parsed, { digitsOnly: true });
  }
  return deadline;
};

export interface ExtendedProjectCheckpoint {
  title: string
  deadline: string
  isBase?: boolean
  customIndex?: number
}

interface CheckpointsBlockProps {
  checkpoints: ExtendedProjectCheckpoint[]
  addCheckpoint: () => void
  onEditCheckpoint?: (index: number) => void
  onDeleteCheckpoint?: (index: number) => void
  isBlink?: boolean
}

export const CheckpointsBlock = ({checkpoints, addCheckpoint, onEditCheckpoint, onDeleteCheckpoint, isBlink}: CheckpointsBlockProps) => {
  return (
    <div className={clsx(styles.checkpointsBlock, isBlink && 'blink-1')}>
      <div className={styles.checkpointsList}>
        {
          checkpoints.map((checkpoint, index) => {
            const isCustom = !checkpoint.isBase;
            const targetIdx = checkpoint.customIndex ?? index;

            return (
              <div key={index} className={styles.checkpoint}>
                <div className={styles.circle}>
                  {index + 1}
                </div>

                <div className={clsx(styles.content, isCustom ? styles.mutable : '')}>
                  <div className={styles.card}>
                    <div className={styles.textContainer}>
                      <p>
                        {checkpoint.title}
                      </p>
                      <p>
                        {displayDeadline(checkpoint.deadline)}
                      </p>
                    </div>
                    {isCustom && (
                      <div className={styles.actions}>
                        {onEditCheckpoint && (
                          <button type="button" className={styles.actionBtn} onClick={() => onEditCheckpoint(targetIdx)}>
                            <EditIcon className={styles.icon}/>
                          </button>
                        )}
                        {onDeleteCheckpoint && (
                          <button type="button" className={styles.actionBtn} onClick={() => onDeleteCheckpoint(targetIdx)}>
                            <TrashIcon className={styles.icon}/>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>

      <PlusButton className={styles.button} onClick={addCheckpoint} text={'Добавить ключевую точку'}/>
    </div>
  )
}
