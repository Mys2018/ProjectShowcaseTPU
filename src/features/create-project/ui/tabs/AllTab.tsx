import type { CreateProjectForm, StepErrors } from '../../model/useProjectWizard';
import styles from "./Tabs.module.css";

interface TabProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
}

export function AllTab({ form: _form, stepErrors: _stepErrors }: TabProps) {
  return (
    <div className={styles.mainInfo}>
      <h3>Разделы сплошным списком</h3>
      <p>
        Данный раздел находится в разработке
      </p>
    </div>
  );
}
