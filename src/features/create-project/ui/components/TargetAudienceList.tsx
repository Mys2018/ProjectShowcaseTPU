import type { CreateProjectForm, StepErrors } from '../../model/useProjectWizard';
import { BigTextFieldForm, SmallTextFieldForm } from '@/shared/ui/fields/text-field/TextField.tsx';
import Plus from '@/shared/ui/icons/plus.svg?react';
import TrashIcon from '@/shared/ui/icons/trash.svg?react';
import styles from './TargetAudienceList.module.css';

interface TargetAudienceListProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
}

const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return undefined;
};

export function TargetAudienceList({ form, stepErrors }: TargetAudienceListProps) {
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
          <div className={styles.container}>
            {segments.map((_, index) => {
              const prefix = `prdMeta.audience[${index}]` as any;

              return (
                <div className={styles.body}>

                  <div className={styles.titleContainer}>
                    <p className={styles.titleSegment}>
                      Сегмент {index}
                    </p>
                    {segments.length > 1 && (
                      <button type="button" onClick={() => handleRemove(index)} className={styles.removeButton}>
                        <TrashIcon className={styles.trashIcon}/>
                        Удалить
                      </button>
                    )}
                  </div>

                  <div key={index} className={styles.segment}>
                    <div className={styles.headerRow}>
                      <form.Field name={`${prefix}.title` as any}>
                        {(subField) => (
                          <SmallTextFieldForm
                            placeholder="Например: Студенты"
                            subtitle={"Тип сегмента"}
                            value={subField.state.value}
                            onChange={(e) => subField.handleChange(e.target.value as any)}
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
                          <form.Field name={`${prefix}.minAge` as any}>
                            {(subField) => {
                              const hasError = subField.state.meta.errors.length > 0 || stepErrors[`prdMeta.audience.${index}.minAge`];
                              return (
                                <input
                                  type="number"
                                  className={`${styles.ageInput} ${hasError ? styles.ageError : ''}`}
                                  value={subField.state.value}
                                  onChange={(e) => subField.handleChange(Number(e.target.value) as any)}
                                />
                              );
                            }}
                          </form.Field>

                          <span className={styles.ageLabelInner}>до</span>
                          <form.Field name={`${prefix}.maxAge` as any}>
                            {(subField) => {
                              const hasError = subField.state.meta.errors.length > 0 || stepErrors[`prdMeta.audience.${index}.maxAge`];
                              return (
                                <input
                                  type="number"
                                  className={`${styles.ageInput} ${hasError ? styles.ageError : ''}`}
                                  value={subField.state.value}
                                  onChange={(e) => subField.handleChange(Number(e.target.value) as any)}
                                />
                              );
                            }}
                          </form.Field>
                        </div>
                      </div>
                    </div>



                    <form.Field name={`${prefix}.description` as any}>
                      {(subField) => (
                        <BigTextFieldForm
                          placeholder="Опишите целевую аудиторию подробнее..."
                          subtitle={"Описание сегмента"}
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value as any)}
                          maxLength={500}
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

            <button type="button" className={styles.addButton} onClick={handleAdd}>
              <Plus />
              Добавить сегмент
            </button>

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
