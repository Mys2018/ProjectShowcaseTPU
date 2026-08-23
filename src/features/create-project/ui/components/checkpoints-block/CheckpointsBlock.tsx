import clsx from "clsx";
import styles from './CheckpointsBlock.module.css'
import {PlusButton} from "@/shared/ui/elements/plus-button/PlusButton.tsx";
import EditIcon from '@/shared/ui/icons/pencil.svg?react';
import TrashIcon from '@/shared/ui/icons/trash.svg?react';

export interface ExtendedProjectCheckpoint {
  title: string
  deadline: string
  isImmutable?: boolean;
}

interface CheckpointsBlockProps {
  checkpoints: ExtendedProjectCheckpoint[]
  addCheckpoint: () => void
  onEditCheckpoint?: (index: number) => void
  onDeleteCheckpoint?: (index: number) => void
}

export const CheckpointsBlock = ({checkpoints, addCheckpoint, onEditCheckpoint, onDeleteCheckpoint}: CheckpointsBlockProps) => {
  return (
    <div className={styles.checkpointsBlock}>
      <div className={styles.checkpointsList}>
        {
          checkpoints.map((checkpoint, index) => (
            <div key={index} className={styles.checkpoint}>

              <div className={styles.circle}>
                {index + 1}
              </div>

              <div className={clsx(styles.content, !checkpoint.isImmutable ? styles.mutable: '')}>
                <div className={styles.card}>
                  <div className={styles.textContainer}>
                    <p>
                      {checkpoint.title}
                    </p>
                    <p>
                      {checkpoint.deadline}
                    </p>
                  </div>
                  {!checkpoint.isImmutable && (
                    <div className={styles.actions}>
                      {onEditCheckpoint && (
                        <button type="button" className={styles.actionBtn} onClick={() => onEditCheckpoint(index)}>
                          <EditIcon className={styles.icon}/>
                        </button>
                      )}
                      {onDeleteCheckpoint && (
                        <button type="button" className={styles.actionBtn} onClick={() => onDeleteCheckpoint(index)}>
                          <TrashIcon className={styles.icon}/>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <PlusButton className={styles.button} onClick={addCheckpoint} text={'Добавить ключевую точку'}/>
    </div>
  )
}
