import type { CreateProjectForm, StepErrors } from '../../../model/useProjectWizard.ts';
import { SmallTextFieldForm } from '@/shared/ui/fields/text-field/TextField.tsx';
import clsx from 'clsx';
import styles from './RequirementList.module.css';
import TrashIcon from '@/shared/ui/icons/trash.svg?react'
import { PlusButton } from "@/shared/ui/elements/buttons/plus-button/PlusButton.tsx";
import { EmptyStateBlock } from "@/shared/ui/empty-state-block/EmptyStateBlock.tsx";

interface RequirementListProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
  name: string; // name of the array field, e.g. "prdMeta.functional"
  title?: string;
  placeholder?: string;
  maxLength?: number;
  addBtnText?: string;
  onAddClick?: () => void;
  valueKey?: string;
  subtitleKey?: string;
  minItems?: number;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  isBlink?: boolean;
}

const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return undefined;
};

export function RequirementList({ form, stepErrors, name, title, placeholder, maxLength, addBtnText = 'Добавить пункт', onAddClick, valueKey, subtitleKey, minItems = 2, emptyStateTitle, emptyStateDescription, isBlink }: RequirementListProps) {
  return (
    <div className={clsx(styles.container)}>
      {title && <span className={styles.title}>{title}</span>}

      <form.Field name={name as any} mode="array">
        {(field) => {
          // Initialize with empty array
          const items = (field.state.value as any[]) || [];

          const handleAdd = () => {
            if (onAddClick) {
              onAddClick();
            } else {
              // @ts-ignore
              field.pushValue(valueKey ? { [valueKey]: '', [subtitleKey || 'name']: '' } : '');
            }
          };

          const handleRemove = (index: number) => {
            field.removeValue(index);
          };

          if (items.length === 0 && (emptyStateTitle && emptyStateDescription)) {
            return (
              <div className={styles.errorWrapper}>
                <EmptyStateBlock
                  title={emptyStateTitle}
                  description={emptyStateDescription}
                  buttonText={addBtnText}
                  onAddClick={handleAdd}
                  errorState={false}
                />
                {stepErrors[name] && (
                  <span className={styles.errorText}>
                    {stepErrors[name]?.[0]}
                  </span>
                )}
              </div>
            );
          }

          return (
            <div className={clsx(styles.list, isBlink && 'blink-1')}>
              {items.map((item, index) => {
                const prefix = valueKey ? `${name}[${index}].${valueKey}` as any : `${name}[${index}]` as any;
                const subtitle = subtitleKey && item ? item[subtitleKey] : undefined;

                return (
                  <div key={index} className={styles.item}>
                    <div className={styles.inputWrapper}>
                      <form.Field name={prefix}>
                        {(subField) => (
                          <SmallTextFieldForm
                            placeholder={placeholder}
                            subtitle={subtitle}
                            value={(subField.state.value as string) || ''}
                            onChange={(e) => subField.handleChange(e.target.value as any)}
                            maxLength={maxLength}
                            validError={
                              subField.state.meta.errors.length > 0
                                ? getErrorMessage(subField.state.meta.errors[0])
                                : stepErrors[valueKey ? `${name}.${index}.${valueKey}` : `${name}.${index}`]?.[0]
                            }
                            children={
                              items.length > minItems && (
                                <button type="button" onClick={() => handleRemove(index)} className={styles.removeButton}>
                                  <TrashIcon />
                                </button>
                              )
                            }
                          />
                        )}
                      </form.Field>
                    </div>
                  </div>
                );
              })}

              <PlusButton text={addBtnText} onClick={handleAdd} />

              {field.state.meta.errors.length > 0 && (
                <span className={styles.errorText}>{getErrorMessage(field.state.meta.errors[0])}</span>
              )}
              {stepErrors[name] && (
                <span className={styles.errorText}>{stepErrors[name]?.[0]}</span>
              )}
            </div>
          );
        }}
      </form.Field>
    </div>
  );
}
