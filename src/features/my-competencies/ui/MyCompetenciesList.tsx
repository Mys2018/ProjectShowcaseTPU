import { useEffect, useState } from 'react';
import styles from './MyCompetenciesList.module.css';
import { MyCompetencies } from "@/features/my-competencies/ui/MyCompetencies.tsx";
import Plus from '@/shared/ui/icons/plus.svg?react';
import Pencil from '@/shared/ui/icons/pencil.svg?react';
import { EmptyStateBlock, FooterBlockFields } from "@/shared";
import { useSkillsStore } from "@/features/my-competencies/model/store/useSkillsStore.ts";
import { useModalStore, useProfileEditStore } from "@/shared/model";
import { useUpdateProfileMeta } from '@/entities/user/api/queries';
import { useSkills } from '@/entities/skill';
import type { CompetenceDto } from '@/entities/user/model/types';

type MyCompetenciesListProps = {
  savedSkills?: CompetenceDto[];
  readonly?: boolean;
};

export function MyCompetenciesList({ savedSkills, readonly = false }: MyCompetenciesListProps) {
  const {
    draftData,
    isEditing,
    popoverOpenFor,
    currentFullSkills,
    hasChanges,
    setInitialData,
    setGlobalSkills,
    startEditing,
    cancelEditing,
    saveChanges,
    removeSkill,
    addSkill,
    removeCompetency,
    setPopoverOpenFor,
    getSkillsForCompetence,
  } = useSkillsStore();

  const { setActiveEditBlock, setHasUnsavedChanges } = useProfileEditStore();
  const { openModal, closeModal } = useModalStore();
  const { mutate: updateProfile, isPending } = useUpdateProfileMeta();
  const { data: globalSkillsData } = useSkills();
  const [showSaveError, setShowSaveError] = useState(false);

  const handleStartEditing = () => {
    setActiveEditBlock('competencies');
    setHasUnsavedChanges(hasChanges);
    startEditing();
  };

  useEffect(() => {
    if (isEditing) {
      setHasUnsavedChanges(hasChanges);
    }
  }, [isEditing, hasChanges, setHasUnsavedChanges]);

  const handleCancelEditing = () => {
    if (hasChanges) {
      openModal('CONFIRM_SAVE', {
        title: 'Сохранить изменения?',
        cancelText: 'Удалить',
        confirmText: 'Сохранить',
        onDecline: () => {
          closeModal();
          cancelEditing();
          setActiveEditBlock(null);
          setHasUnsavedChanges(false);
        },
        onConfirm: () => {
          closeModal();
          handleSave();
        }
      });
    } else {
      cancelEditing();
      setActiveEditBlock(null);
      setHasUnsavedChanges(false);
    }
  };

  useEffect(() => {
    if (globalSkillsData) {
      setGlobalSkills(globalSkillsData);
    }
  }, [globalSkillsData, setGlobalSkills]);

  useEffect(() => {
    setShowSaveError(false);
  }, [draftData]);

  useEffect(() => {
    if (savedSkills && Array.isArray(savedSkills)) {
      setInitialData(savedSkills.map(c => ({
        ...c,
        skills: c.skills.map((s: any) => ({
          id: s.skillId || s.id,
          name: s.skillName || s.name,
          roleTypeId: c.roleTypeId
        }))
      })));
    }
  }, [savedSkills, setInitialData]);

  const handleSave = () => {
    if (hasEmptyCompetencies) {
      setShowSaveError(true);
      return;
    }

    const skillsPayload = draftData.map(comp => ({
      roleTypeId: comp.roleTypeId,
      skillIds: comp.skills.map(s => s.id)
    }));

    updateProfile(
      { skills: skillsPayload },
      {
        onSuccess: () => {
          saveChanges();
          setActiveEditBlock(null);
          setHasUnsavedChanges(false);
        }
      }
    );
  };

  const hasEmptyCompetencies = draftData.some(comp => comp.skills.length === 0);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.bioContainer}>
        {(!readonly || draftData.length > 0) && <h3>Мои навыки</h3>}
        {(!isEditing && !readonly && draftData.length > 0) && (
          <button
            className={styles.editButton}
            onClick={handleStartEditing}
            disabled={isPending}
          >
            <Pencil />
            Редактировать
          </button>
        )}
      </div>
      {
        !readonly && !isEditing && draftData.length === 0 ? (
          <EmptyStateBlock
            onAddClick={() => {
              handleStartEditing();
              openModal('COMPETENCY_CHOICE');
            }}
            title={'Кем хотите быть в проектах?'}
            description={'Укажите свои компетенции и навыки, чтобы находить подходящие проекты и откликаться на них.'}
            buttonText={'Добавить компетенцию'}
            firstTime={true}
          />
        ) : (
          <div className={styles.myCompetenciesList}>
            {draftData.map((competency) => (
              <div key={competency.roleTypeId} className={styles.competencyContainer}>
                <MyCompetencies
                  data={competency}
                  removeSkill={removeSkill}
                  addSkill={addSkill}
                  removeCompetency={removeCompetency}
                  popoverOpenFor={popoverOpenFor}
                  setPopoverOpenFor={setPopoverOpenFor}
                  isEditing={isEditing}
                  getSkillsForCompetence={getSkillsForCompetence}
                  currentFullSkills={currentFullSkills}
                  isLastCompetency={draftData.length === 1}
                />
              </div>
            ))}
          </div>
        )
      }

      {isEditing &&
        <button
          className={styles.addCompetencyBtn}
          onClick={() => openModal('COMPETENCY_CHOICE')}
          disabled={isPending}
        >
          <Plus />
          Добавить компетенцию
        </button>
      }
      {isEditing && (
        <div className={styles.footerContainer}>
          <FooterBlockFields
            handleCancel={handleCancelEditing}
            handleSubmit={handleSave}
            disabled={!hasChanges || isPending}
            customError={showSaveError && hasEmptyCompetencies ? "Выберите хотя бы по 1 навыку в каждой компетенции" : undefined}
          />
        </div>
      )}
    </div>
  );
}