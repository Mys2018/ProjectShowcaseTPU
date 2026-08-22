import styles from "./Tabs.module.css";
import { ProjectRoleCard } from '../components/project-role-card/ProjectRoleCard.tsx';
import type { CreateProjectForm, StepErrors } from '../../model/useProjectWizard';
import { useSkills } from '@/entities/skill';
import { useModalStore, AddOutlineButton, EmptyStateBlock } from '@/shared';

interface TabProps {
  form: CreateProjectForm;
  stepErrors?: StepErrors;
}

export function RolesTab({ form, stepErrors }: TabProps) {
  const { openModal } = useModalStore();
  const { data: globalSkills = [] } = useSkills();

  const handleAddRoleClick = () => {
    const currentRoles = form.state.values.roles || [];

    openModal('COMPETENCY_CHOICE', {
      initialSelectedIds: currentRoles.map(r => r.roleTypeId),
      onSubmitCallback: (selectedRoles: { id: string, name: string }[]) => {
        const currentRolesForSubmit = form.state.values.roles || [];
        const newRoles = selectedRoles.map(selectedRole => {
          const existing = currentRolesForSubmit.find(r => r.roleTypeId === selectedRole.id);
          if (existing) return existing;
          return {
            roleTypeId: selectedRole.id,
            placesCount: 1,
            minPlacesCount: 1,
            meta: { name: selectedRole.name, description: '' },
            skills: [],
          };
        });
        form.setFieldValue('roles', newRoles);
      }
    });
  };

  return (
    <div className={styles.mainFieldContainer}>
      <div className={styles.mainInfo}>
        <h3>Компетенции проекта</h3>
        <p>
          Открытые компетенции с входящими заявками от участников
        </p>
      </div>
      <div className={styles.errorWrapper}>
        <form.Field name="roles" mode="array">
          {(field) => {
            const roles = field.state.value || [];

            if (roles.length === 0) {
              return (
                <EmptyStateBlock
                  title="Какие специалисты нужны проекту?"
                  description={<>Укажите компетенции и навыки, необходимые<br/>для успешной реализации ваших задач.</>}
                  buttonText="Добавить компетенцию"
                  onAddClick={handleAddRoleClick}
                  errorState={!!stepErrors?.['roles']}
                />
              );
            }

            return (
              <div className={styles.competencyList}>
                {roles.map((_, index) => (
                  <ProjectRoleCard
                    key={index}
                    index={index}
                    form={form}
                    globalSkills={globalSkills}
                  />
                ))}

                <AddOutlineButton
                  text="Добавить компетенцию"
                  onClick={handleAddRoleClick}
                />
              </div>
            );
          }}
        </form.Field>

        {stepErrors?.['roles'] && (
          <p className={styles.errorText}>
            {stepErrors['roles'][0]}
          </p>
        )}
      </div>
    </div>
  );
}

