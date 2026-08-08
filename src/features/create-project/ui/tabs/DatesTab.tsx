import type { CreateProjectForm, StepErrors } from '../../model/useProjectWizard';
import styles from "./Tabs.module.css";
import {useModalStore} from "@/shared/model";
import {CheckpointsBlock} from "@/features/create-project/ui/components/checkpoints-block/CheckpointsBlock.tsx";

interface TabProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
}

export const DatesTab = ({ form }: TabProps) => {

  const { openModal, closeModal } = useModalStore();

  return (
    <div className={styles.mainFieldContainer}>
      <div className={styles.mainInfo}>
        <h3>Таймлайн проекта</h3>
        <p>
          Открытые компетенции с входящими заявками от участников
        </p>
      </div>

      <form.Field name="checkpoints" mode='array'>
        {
          (field) => {
            const checkpoints = field.state.value || []

            const sortCheckpoints = (cps: { title: string; deadline: string }[]) => {
              return [...cps].sort((a, b) => {
                const dateA = new Date(a.deadline).getTime();
                const dateB = new Date(b.deadline).getTime();
                return dateA - dateB;
              });
            };

            const addDays = (dateString : string, days: number) => {
              if (!dateString) return '';
              const date = new Date(dateString);
              date.setUTCDate(date.getUTCDate() + days);
              return date.toISOString().split('T')[0];
            };
            
            const minDate = addDays(checkpoints[0].deadline, 1);
            const maxDate = addDays(checkpoints[checkpoints.length - 1].deadline, -1);

            const handleAdd = () => {
              openModal('ADD_CHECKPOINT', {
                minDate,
                maxDate,
                onConfirm: (title: string, deadline: string) => {
                  closeModal();
                  field.setValue(sortCheckpoints([...checkpoints, { title, deadline }]));
                }
              })
            }

            const handleEdit = (index: number) => {
              const checkpoint = checkpoints[index];
              openModal('ADD_CHECKPOINT', {
                initialTitle: checkpoint.title,
                initialDeadline: checkpoint.deadline,
                minDate,
                maxDate,
                onConfirm: (title: string, deadline: string) => {
                  closeModal();
                  const newCheckpoints = [...checkpoints];
                  newCheckpoints[index] = { ...newCheckpoints[index], title, deadline };
                  field.setValue(sortCheckpoints(newCheckpoints));
                }
              })
            }

            const handleDelete = (index: number) => {
              const newCheckpoints = [...checkpoints];
              newCheckpoints.splice(index, 1);
              field.setValue(newCheckpoints);
            }

            return (
              <CheckpointsBlock 
                checkpoints={checkpoints} 
                addCheckpoint={handleAdd}
                onEditCheckpoint={handleEdit}
                onDeleteCheckpoint={handleDelete}
              />
            )
          }
        }
      </form.Field>
    </div>

  );
}
