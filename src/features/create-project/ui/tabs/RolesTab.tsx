import { useModalStore } from '@/shared/model';
import { useSkills } from '@/entities/user/api/queries';
import { ProjectRoleCard } from '../components/ProjectRoleCard';
import type { CreateProjectForm, StepErrors } from '../../model/useProjectWizard';
import Plus from '@/shared/ui/icons/plus.svg?react';
import styles from "./Tabs.module.css";

interface TabProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
}

export function RolesTab({ form, stepErrors: _stepErrors }: TabProps) {
  const { openModal } = useModalStore();
  const { data: globalSkills = [] } = useSkills(); // Fetch all skills to pass to the role cards

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
    <div>
      <div className={styles.mainInfo}>
        <h3>Компетенции проекта</h3>
        <p>
          Открытые компетенции с входящими заявками от участников
        </p>
      </div>

      <form.Field name="roles" mode="array">
        {(field) => {
          const roles = field.state.value || [];
          
          if (roles.length === 0) {
            return (
              <div className={styles.emptyStateBlock}>
                <div className={styles.textBlock}>
                  <h4>Какие специалисты нужны проекту?</h4>
                  <p>Укажите компетенции и навыки, необходимые<br/>для успешной реализации ваших задач.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddRoleClick}
                  className={styles.addRoleButtonEmpty}
                >
                  <Plus/>
                  Добавить компетенцию
                </button>
              </div>
            );
          }

          return (
            <div style={{ marginTop: '24px' }}>
              {roles.map((_, index) => (
                <ProjectRoleCard 
                  key={index} 
                  index={index} 
                  form={form} 
                  globalSkills={globalSkills} 
                />
              ))}

              <button 
                type="button" 
                onClick={handleAddRoleClick}
                className={styles.addRoleButtonEmpty}
              >
                <Plus/>
                Добавить компетенцию
              </button>
            </div>
          );
        }}
      </form.Field>
    </div>
  );
}

