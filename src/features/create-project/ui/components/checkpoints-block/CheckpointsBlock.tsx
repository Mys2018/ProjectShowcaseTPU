import styles from './CheckpointsBlock.module.css'
import type {ProjectCheckpoint} from "@/entities/project";
import {PlusButton} from "@/shared/ui/elements/plus-button/PlusButton.tsx";

interface CheckpointsBlockProps {
  checkpoints: ProjectCheckpoint[]
}

export const CheckpointsBlock = ({checkpoints}: CheckpointsBlockProps) => {
  return (
    <div className={styles.checkpointsBlock}>
      <div className={styles.checkpointsList}>
        {
          checkpoints.map((checkpoint, index) => (
            <div className={styles.checkpoint}>

              <div className={styles.circle}>
                {index + 1}
              </div>

              <div className={styles.content}>
                <div className={styles.card}>
                  <p>
                    {checkpoint.title}
                  </p>
                  <p>
                    {checkpoint.deadline}
                  </p>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <PlusButton className={styles.button} onClick={() => {}} text={'Добавить ключевую точку'}/>
    </div>
  )
}
