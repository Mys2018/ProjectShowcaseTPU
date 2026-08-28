import type { CreateProjectForm, StepErrors } from '../../model/useProjectWizard';
import { BigTextFieldForm, SmallTextFieldForm } from '@/shared/ui/fields/text-field/TextField.tsx';
import { DropDownList } from '@/shared/ui/fields/dropdown-list/DropDownList';
import { RadioChip } from '@/shared/ui/fields/radio-chip/RadioChip';
import Cross from '@/shared/ui/icons/cross.svg?react';
import clsx from 'clsx';
import styles from '../ProjectInfoStep.module.css';

import { useTags } from '@/entities/tag/api/queries';
import { InfoTooltip } from "@/shared";

interface TabProps {
  form: CreateProjectForm;
  stepErrors: StepErrors;
  partners: { value: string; verbose: string }[];
  blinkFields: string[];
}

export function MainInfoTab({ form, stepErrors, partners, blinkFields }: TabProps) {
  const { data: tagGroups = [] } = useTags();

  const allTags = tagGroups.flatMap(group =>
    group.tags.map(t => ({ label: t.name, value: t.id }))
  );

  const getErrorMessage = (error: unknown): string | undefined => {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return undefined;
  };

  return (
    <div className={clsx(styles.mainFieldContainer)}>
      <div className={styles.mainInfo}>
        <h5>
          Заполните основную информацию
        </h5>
        <p>
          После этого вы сможете создать проект и перейти к PRD
        </p>
      </div>

      {/* Название */}
      <div className={styles.block} id="field-meta-title">
        <h4 className={styles.title}>
          Название проекта
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
            type={'bulb'}
          />
        </h4>
        <form.Field name="meta.title">
          {(field) => (
            <SmallTextFieldForm
              title={''}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={"Например: FinTrack — учёт финансов"}
              maxLength={100}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['meta.title']?.[0]}
              isBlink={blinkFields.includes('Название проекта')}
            />
          )}
        </form.Field>
      </div>


      {/* Описание */}
      <div className={styles.block} id="field-meta-description">
        <h4 className={styles.title}>
          Описание
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
            type={'bulb'}
          />
        </h4>

        <form.Field name="meta.description">
          {(field) => (
            <BigTextFieldForm
              title={''}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={"Например: FinTrack — учёт финансов"}
              maxLength={500}
              validError={getErrorMessage(field.state.meta.errors[0]) || stepErrors['meta.description']?.[0]}
              isBlink={blinkFields.includes('Описание')}
            />
          )}
        </form.Field>
      </div>


      {/* Основной тег — RadioChip */}
      <form.Field name="primaryTag">
        {(field) => (
          <div className={styles.tagGroup} id="field-primary-tag">
            <span className={styles.tagGroupLabel}>Основной тег</span>
            <div className={styles.chipRow}>
              {allTags.map((tag) => (
                <RadioChip
                  key={tag.value}
                  label={tag.label}
                  name="primaryTag"
                  value={tag.value}
                  checked={field.state.value === tag.value}
                  isBlink={blinkFields.includes('Основной тег')}
                  onChange={() => {
                    field.handleChange(tag.value);
                    form.setFieldValue('extraFieldsForAll.primaryTagName', tag.label);
                    const currentTags = form.state.values.tags || [];
                    if (currentTags.includes(tag.value)) {
                      form.setFieldValue('tags', currentTags.filter(t => t !== tag.value));
                      const currentExtraTags = form.state.values.extraFieldsForAll?.tags || [];
                      form.setFieldValue('extraFieldsForAll.tags', currentExtraTags.filter(t => t !== tag.label));
                    }
                  }}
                />
              ))}
            </div>
            {(field.state.meta.errors.length > 0 || stepErrors['primaryTag']) && (
              <span className={styles.errorText}>
                {getErrorMessage(field.state.meta.errors[0]) || stepErrors['primaryTag']?.[0]}
              </span>
            )}
          </div>
        )}
      </form.Field>

      {/* Дополнительные теги — мульти-выбор плашками */}
      <form.Subscribe selector={(state) => state.values.primaryTag}>
        {(primaryTag) => (
          <form.Field name="tags">
            {(field) => {
              const availableExtraTags = allTags.filter(t => t.value !== primaryTag);

              return (
                <div className={styles.tagGroup} id="field-tags">
                  <span className={styles.tagGroupLabel}>Дополнительные теги</span>
                  <div className={styles.tagBadgeRow}>
                    {availableExtraTags.map((tag) => {
                      const isSelected = (field.state.value || []).includes(tag.value);
                      return (
                        <button
                          key={tag.value}
                          type="button"
                          className={clsx(styles.tagBadge, isSelected && styles.tagBadgeActive, blinkFields.includes('Основной тег') && 'blink-1')}
                          onClick={() => {
                            const current = field.state.value || [];
                            field.handleChange(
                              isSelected
                                ? current.filter((t) => t !== tag.value)
                                : [...current, tag.value],
                            );

                            const currentExtraTags = form.state.values.extraFieldsForAll?.tags || [];
                            const newExtraTags = isSelected
                              ? currentExtraTags.filter(t => t !== tag.label)
                              : [...currentExtraTags, tag.label];
                            form.setFieldValue('extraFieldsForAll.tags', newExtraTags);
                          }}
                        >
                          {tag.label}
                          {isSelected && <Cross className={styles.crossIcon} />}
                        </button>
                      );
                    })}
                  </div>
                  {(field.state.meta.errors.length > 0 || stepErrors['tags']) && (
                    <span className={styles.errorText}>
                      {getErrorMessage(field.state.meta.errors[0]) || stepErrors['tags']?.[0]}
                    </span>
                  )}
                </div>
              );
            }}
          </form.Field>
        )}
      </form.Subscribe>


      {/* Партнёр */}
      <div id="field-partner">
        <form.Field name="partnerId">
          {(field) => {
            // DropDownList работает со строками; внутренне храним ID
            const selectedVerbose = partners.find((p) => p.value === field.state.value)?.verbose;
            return (
              <DropDownList
                label="Заказчик"
                options={partners.map((p) => p.verbose)}
                value={selectedVerbose}
                onChange={(verbose) => {
                  const partner = partners.find((p) => p.verbose === verbose);
                  field.handleChange(partner?.value ?? '');
                  form.setFieldValue('extraFieldsForAll.partnerName', partner?.verbose ?? '');
                }}
                placeholder="Выберите заказчика"
                error={
                  getErrorMessage(field.state.meta.errors[0]) ||
                  stepErrors['partnerId']?.[0]
                }
                isBlink={blinkFields.includes('Заказчик')}
              />
            );
          }}
        </form.Field>
      </div>
    </div>
  );
}
