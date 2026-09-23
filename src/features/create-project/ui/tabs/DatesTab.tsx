import { useEffect } from 'react';
import styles from "./Tabs.module.css";
import type { CreateProjectForm, StepErrors } from '../../model/useProjectWizard';
import { CheckpointsBlock } from "../components/checkpoints-block/CheckpointsBlock.tsx";
import { RequirementList } from "../components/requirement-list/RequirementList.tsx";
import { EmptyStateBlock, InfoTooltip, mapDateToBackendString, useModalStore } from "@/shared";
import type { Platform } from "@/entities/platforms/model/types.ts";
import { useCurrentCheckpoints } from "@/entities/checkpoint";
import {TooltipsText} from "@/shared/constants";

interface TabProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
  blinkFields: string[];
}

export const DatesTab = ({ form, stepErrors, blinkFields }: TabProps) => {
  const { openModal, closeModal } = useModalStore();
  const { data: currentGroup } = useCurrentCheckpoints();

  useEffect(() => {
    if (currentGroup?.id) {
      form.setFieldValue('checkpoints', currentGroup.id);
    }
  }, [currentGroup?.id, form]);

  return (
    <div className={styles.mainFieldContainer}>
      <div className={styles.mainInfo}>
        <h3>Таймлайн проекта</h3>
        <p>
          компетенции с входящими заявками от участников
        </p>
      </div>

      <div className={styles.block}>
        <h4 className={styles.title}>
          Ключевые точки
          <InfoTooltip
            className={styles.tooltip}
            iconClassName={styles.tooltipIcon}
            title={TooltipsText.checkpoints.title}
            body={
             TooltipsText.checkpoints.body
            }
            size={'large'}
            pointer={'topLeft'}
            type={'bulb'}
          />
        </h4>

        <div className={styles.errorWrapper}>
          <form.Field name="customCheckpoints" mode='array'>
            {
              (field) => {
                const customCheckpoints = field.state.value || []

                const baseCheckpoints = (currentGroup?.checkpoints || []).map(cp => ({
                  title: cp.title,
                  deadline: mapDateToBackendString(cp.deadline),
                  isBase: true,
                }))

                const mentorCheckpoints = customCheckpoints.map((cp, idx) => ({
                  title: cp.title,
                  deadline: cp.deadline,
                  isBase: false,
                  customIndex: idx,
                }))

                const mergedCheckpoints = [...baseCheckpoints, ...mentorCheckpoints].sort((a, b) => {
                  const dateA = new Date(a.deadline).getTime();
                  const dateB = new Date(b.deadline).getTime();
                  return dateA - dateB;
                });

                const addDays = (dateString: string, days: number) => {
                  if (!dateString) return '';
                  const date = new Date(dateString);
                  date.setUTCDate(date.getUTCDate() + days);
                  return date.toISOString().split('T')[0];
                };

                const minDate = addDays(mergedCheckpoints[0]?.deadline || '', 1);
                const maxDate = addDays(mergedCheckpoints[mergedCheckpoints.length - 1]?.deadline || '', -1);

                const handleAdd = () => {
                  openModal('ADD_CHECKPOINT', {
                    minDate,
                    maxDate,
                    onConfirm: (title: string, deadline: string) => {
                      closeModal();
                      field.setValue([...customCheckpoints, { title, deadline }]);
                    }
                  })
                }

                const handleEdit = (customIndex: number) => {
                  const checkpoint = customCheckpoints[customIndex];
                  if (!checkpoint) return;
                  openModal('ADD_CHECKPOINT', {
                    initialTitle: checkpoint.title,
                    initialDeadline: checkpoint.deadline,
                    minDate,
                    maxDate,
                    onConfirm: (title: string, deadline: string) => {
                      closeModal();
                      const newCustom = [...customCheckpoints];
                      newCustom[customIndex] = { title, deadline };
                      field.setValue(newCustom);
                    }
                  })
                }

                const handleDelete = (customIndex: number) => {
                  const newCustom = [...customCheckpoints];
                  newCustom.splice(customIndex, 1);
                  field.setValue(newCustom);
                }

                return (
                  <CheckpointsBlock
                    checkpoints={mergedCheckpoints}
                    addCheckpoint={handleAdd}
                    onEditCheckpoint={handleEdit}
                    onDeleteCheckpoint={handleDelete}
                    isBlink={blinkFields.includes('Ключевые точки')}
                  />
                )
              }
            }
          </form.Field>

          {stepErrors?.['checkpoints'] && (
            <span className={styles.errorText}>
              {stepErrors['checkpoints'][0]}
            </span>
          )}
          {stepErrors?.['customCheckpoints'] && (
            <span className={styles.errorText}>
              {stepErrors['customCheckpoints'][0]}
            </span>
          )}
        </div>
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
            title={TooltipsText.resources.title}
            body={
              TooltipsText.resources.body
            }
            size={'large'}
            pointer={'topLeft'}
            type={'bulb'}
          />
        </h4>
        <div className={styles.errorWrapper}>
          <form.Field name={'links'}>
            {
              (field) => {
                const links = field.state.value || []

                const handleAddLinkClick = () => {
                  openModal(
                    'SELECT_PROJECT_LINKS',
                    {
                      initialSelected: links.map(l => ({ platformId: l.platformId, name: l.name, category: l.category }) as Platform),
                      onConfirm: (selectedPlatforms: Platform[]) => {
                        const newLinks = selectedPlatforms.map(sp => {
                          const existing = links.find(l => l.platformId === sp.platformId);
                          return existing ? existing : { ...sp, link: '' };
                        });
                        form.setFieldValue('links', newLinks);
                      }
                    }
                  );
                };

                if (links.length === 0) return (
                  <EmptyStateBlock
                    title="Добавьте ссылки на необходимые сервисы"
                    buttonText="Добавить"
                    onAddClick={handleAddLinkClick}
                    errorState={!!stepErrors?.['links']}
                  />
                );

                return (
                  <RequirementList
                    form={form}
                    stepErrors={stepErrors}
                    name="links"
                    placeholder="Вставьте ссылку"
                    addBtnText="Добавить сервис"
                    onAddClick={handleAddLinkClick}
                    valueKey="link"
                    subtitleKey="name"
                    minItems={0}
                    emptyStateTitle="Добавьте ссылки на необходимые сервисы"
                    isBlink={blinkFields.includes('Ресурсы')}
                  />
                )
              }
            }
          </form.Field>

          {stepErrors?.['links'] && (
            <span className={styles.errorText}>
              {stepErrors['links'][0]}
            </span>
          )}

        </div>



      </div>
    </div>
  );
}