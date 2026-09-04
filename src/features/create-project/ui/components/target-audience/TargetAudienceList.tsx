import type { CreateProjectForm, StepErrors, CreateProjectFormValues } from '../../../model/useProjectWizard.ts';
import type { DeepKeys } from '@tanstack/react-form';
import { BigTextFieldForm, SmallTextFieldForm } from '@/shared/ui/fields/text-field/TextField.tsx';

type FieldName = DeepKeys<CreateProjectFormValues>;
import clsx from 'clsx';
import TrashIcon from '@/shared/ui/icons/trash.svg?react';
import styles from './TargetAudienceList.module.css';
import {AddOutlineButton} from "@/shared";

interface TargetAudienceListProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
  blinkFields?: string[];
}

const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return undefined;
};

export function TargetAudienceList({ form, stepErrors, blinkFields }: TargetAudienceListProps) {
  return (
    <form.Field name="prdMeta.audience" mode="array">
      {(field) => {
        const segments = field.state.value || [];

        const handleAdd = () => {
          field.pushValue({
            title: '',
            description: '',
            minAge: 18,
            maxAge: 35,
          });
        };

        const handleRemove = (index: number) => {
          field.removeValue(index);
        }


        return (
          <div className={clsx(styles.container)}>
            {segments.map((_, index) => {
              const prefix = `prdMeta.audience[${index}]` as FieldName;

              return (
                <div  className={clsx(styles.body)} key={prefix}>

                  <div className={styles.titleContainer}>
                    <p className={styles.titleSegment}>
                      Сегмент {index + 1}
                    </p>
                    {segments.length > 1 && (
                      <button type="button" onClick={() => handleRemove(index)} className={styles.removeButton}>
                        <TrashIcon className={styles.trashIcon}/>
                        Удалить
                      </button>
                    )}
                  </div>

                  <div key={index} className={clsx(styles.segment, blinkFields?.includes(`Сегмент ${index + 1}`) && 'blink-1')}>
                    <div className={styles.headerRow}>
                      <form.Field name={`${prefix}.title` as FieldName}>
                        {(subField) => (
                          <SmallTextFieldForm
                            placeholder="Например: Студенты"
                            subtitle={"Тип сегмента"}
                            value={subField.state.value as string}
                            onChange={(e) => subField.handleChange(e.target.value as never)}
                            maxLength={70}
                            validError={
                              subField.state.meta.errors.length > 0
                                ? getErrorMessage(subField.state.meta.errors[0])
                                : stepErrors[`prdMeta.audience.${index}.title`]?.[0]
                            }
                          />
                        )}
                      </form.Field>

                      <div className={styles.ageColumn}>
                        <span className={styles.ageLabel}>Возраст</span>
                        <div className={styles.ageInputRow}>
                          <span className={styles.ageLabelInner}>от</span>
                          <form.Field name={`${prefix}.minAge` as FieldName}>
                            {(subField) => {
                              const hasError = subField.state.meta.errors.length > 0 || stepErrors[`prdMeta.audience.${index}.minAge`];
                              return (
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  className={`${styles.ageInput} ${hasError ? styles.ageError : ''}`}
                                  value={subField.state.value as number}
                                  onChange={(e) => {
                                    let val = Number(e.target.value);
                                    if (val < 0) val = 0;
                                    if (val > 100) val = 100;
                                    subField.handleChange(val as never);
                                  }}
                                />
                              );
                            }}
                          </form.Field>

                          <span className={styles.ageLabelInner}>до</span>
                          <form.Field name={`${prefix}.maxAge` as FieldName}>
                            {(subField) => {
                              const hasError = subField.state.meta.errors.length > 0 || stepErrors[`prdMeta.audience.${index}.maxAge`];
                              return (
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  className={`${styles.ageInput} ${hasError ? styles.ageError : ''}`}
                                  value={subField.state.value as number}
                                  onChange={(e) => {
                                    let val = Number(e.target.value);
                                    if (val < 0) val = 0;
                                    if (val > 100) val = 100;
                                    subField.handleChange(val as never);
                                  }}
                                />
                              );
                            }}
                          </form.Field>
                        </div>
                      </div>
                    </div>



                    <form.Field name={`${prefix}.description` as FieldName}>
                      {(subField) => (
                        <BigTextFieldForm
                          placeholder="Опишите целевую аудиторию подробнее..."
                          subtitle={"Описание сегмента"}
                          value={subField.state.value as string}
                          onChange={(e) => subField.handleChange(e.target.value as never)}
                          maxLength={200}
                          validError={
                            subField.state.meta.errors.length > 0
                              ? getErrorMessage(subField.state.meta.errors[0])
                              : stepErrors[`prdMeta.audience.${index}.description`]?.[0]
                          }
                        />
                      )}
                    </form.Field>
                  </div>
                </div>
              );
            })}

            {segments.length < 4 && (
              <AddOutlineButton onClick={handleAdd} text="Добавить сегмент"/>
            )}

            {field.state.meta.errors.length > 0 && (
              <span className={styles.errorText}>{getErrorMessage(field.state.meta.errors[0])}</span>
            )}
            {stepErrors['prdMeta.audience'] && (
              <span className={styles.errorText}>{stepErrors['prdMeta.audience'][0]}</span>
            )}
          </div>
        );
      }}
    </form.Field>
  );
}
