import type { CreateProjectForm, StepErrors } from '../../model/useProjectWizard';
import styles from "./Tabs.module.css";
// import {useModalStore} from "@/shared/model";
import {CheckpointsBlock} from "@/features/create-project/ui/components/checkpoints-block/CheckpointsBlock.tsx";

interface TabProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
}

export const DatesTab = ({ form }: TabProps) => {

  // const { openModal } = useModalStore();

  // const handleAdd = () => {
  //   openModal('CHECKPOINTS')
  // }

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

            return (
              <CheckpointsBlock checkpoints={checkpoints}/>
            )
          }
        }
      </form.Field>
    </div>

  );
}
