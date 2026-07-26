import type { CreateProjectForm, StepErrors } from '../../model/useProjectWizard';
import {SmallTextFieldForm} from '@/shared/ui/fields/text-field/TextField.tsx';
import styles from './RequirementList.module.css';
import PlusIcon from '@/shared/ui/icons/plus.svg?react'
import TrashIcon from '@/shared/ui/icons/trash.svg?react'

interface RequirementListProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
  name: any; // name of the array field, e.g. "prdMeta.functional"
  title?: string;
  placeholder?: string;
  maxLength?: number;
}

const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return undefined;
};

export function RequirementList({ form, stepErrors, name, title, placeholder, maxLength = 600 }: RequirementListProps) {
  return (
    <div className={styles.container}>
      {title && <span className={styles.title}>{title}</span>}
      
      <form.Field name={name} mode="array">
        {(field) => {
          // Initialize with 3 items if empty
          const items = (field.state.value as string[]) || [];

          const handleAdd = () => {
            // @ts-ignore
            field.pushValue('');
          };

          const handleRemove = (index: number) => {
            field.removeValue(index);
          };

          return (
            <div className={styles.list}>
              {items.map((_, index) => {
                const prefix = `${name}[${index}]` as any;
                
                return (
                  <div key={index} className={styles.item}>
                    <div className={styles.inputWrapper}>
                      <form.Field name={prefix}>
                        {(subField) => (
                          <SmallTextFieldForm
                            placeholder={placeholder}
                            value={subField.state.value as string}
                            onChange={(e) => subField.handleChange(e.target.value as any)}
                            maxLength={maxLength}
                            validError={
                              subField.state.meta.errors.length > 0 
                                ? getErrorMessage(subField.state.meta.errors[0]) 
                                : stepErrors[`${name}.${index}`]?.[0]
                            }
                            children={
                              items.length > 2 && (
                                  <button type="button" onClick={() => handleRemove(index)} className={styles.removeButton}>
                                    <TrashIcon/>
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

              <button type="button" className={styles.addButton} onClick={handleAdd}>
                <span className={styles.plusIcon}><PlusIcon className={styles.plus}/></span>
                Добавить пункт
              </button>

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
