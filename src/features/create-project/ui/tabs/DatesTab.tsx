import type { CreateProjectForm, StepErrors } from '../../model/useProjectWizard';
import styles from "./Tabs.module.css";
import { useModalStore } from "@/shared/model";
import { CheckpointsBlock } from "@/features/create-project/ui/components/checkpoints-block/CheckpointsBlock.tsx";
import { RequirementList } from "@/features/create-project/ui/components/requirement-list/RequirementList.tsx";
import { InfoTooltip } from "@/shared";

interface TabProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
}

export const DatesTab = ({ form, stepErrors }: TabProps) => {

  const { openModal, closeModal } = useModalStore();

  return (
    <div className={styles.mainFieldContainer}>
      <div className={styles.errorWrapper}>
        <div className={styles.mainInfo}>
          <h3>Таймлайн проекта</h3>
          <p>
            Открытые компетенции с входящими заявками от участников
          </p>
        </div>

        {stepErrors?.['checkpoints'] && (
          <span className={styles.errorText}>
            {stepErrors['checkpoints'][0]}
          </span>
        )}
      </div>


      <div className={styles.block}>
        <h4 className={styles.title}>
          Ключевые точки
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
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

              const addDays = (dateString: string, days: number) => {
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <CheckpointsBlock
                    checkpoints={checkpoints}
                    addCheckpoint={handleAdd}
                    onEditCheckpoint={handleEdit}
                    onDeleteCheckpoint={handleDelete}
                  />

                  {checkpoints.map((_, idx) => {
                    const titleErr = stepErrors?.[`checkpoints.${idx}.title`]?.[0];
                    const deadlineErr = stepErrors?.[`checkpoints.${idx}.deadline`]?.[0];
                    const msg = titleErr || deadlineErr;
                    if (!msg) return null;
                    return (
                      <span key={idx} style={{ color: '#F14C4C', fontSize: '14px', textAlign: 'center' }}>
                        Точка {idx + 1}: {msg}
                      </span>
                    )
                  })}
                </div>
              )
            }
          }
        </form.Field>
      </div>



      <div className={styles.errorWrapper}>
        <div className={styles.mainInfo}>
          <h3>Ресурсы</h3>
          <p>
            Ссылки с необходимыми для работы пространствами
          </p>
        </div>
      </div>

      <div className={styles.block}>
        <h4 className={styles.title}>
          Список сервисов
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title="Заголовок тултипа"
            body={
              [
                {
                  text: [
                    'Бла бла',
                  ]
                },
              ]
            }
            size={'small'}
            pointer={'topLeft'}
            importantText={'Важно тут!'}
            link={'sdfsdsdsds'}
            type={'bulb'}
          />
        </h4>
        <RequirementList
          form={form}
          stepErrors={stepErrors}
          name="links"
          placeholder="Вставьте ссылку"
          addBtnText="Добавить сервис"
          onAddClick={() => {
            const links = form.state.values.links || [];
            openModal(
              'SELECT_PROJECT_LINKS',
              {
                initialSelected: links.map(l => l.name),
                onConfirm: (selectedLinks: { name: string; link: string }[]) => {
                  const newLinks = selectedLinks.map(sl => {
                    const existing = links.find(l => l.name === sl.name);
                    return existing ? existing : sl;
                  });
                  form.setFieldValue('links', newLinks);
                }
              }
            );
          }}
          valueKey="link"
          subtitleKey="name"
          minItems={0}
          emptyStateTitle="Добавьте ссылки на необходимые сервисы"
        />
      </div>
    </div>
  );
}
