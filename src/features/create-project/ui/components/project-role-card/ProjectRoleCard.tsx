import { useState, useRef, useEffect } from 'react';
import type { CreateProjectForm } from '../../../model/useProjectWizard.ts';
import type { Skill } from '@/features/my-competencies/model/types.ts';
import Cross from '@/shared/ui/icons/cross.svg?react';
import Pencil from '@/shared/ui/icons/pencil.svg?react';
import MoreIcon from '@/shared/ui/icons/more.svg?react';
import CopyIcon from '@/shared/ui/icons/copyCompetency.svg?react';
import DeleteIcon from '@/shared/ui/icons/fillDelete.svg?react';
import EmptyStarIcon from '@/shared/ui/icons/empty_star.svg?react';
// import FullStarIcon from '@/shared/ui/icons/full_star.svg?react';
import { MyCompetenciesModal } from '@/features/my-competencies/ui/MyCompetenciesModal.tsx';
import styles from './ProjectRoleCard.module.css';
import {RequestBlock} from "@/features/create-project/ui/components/request-block/RequestBlock.tsx";
// import compStyles from '@/features/my-competencies/ui/MyCompetencies.module.css';

interface ProjectRoleCardProps {
  form: CreateProjectForm;
  index: number;
  globalSkills: Skill[];
}

export function ProjectRoleCard({ form, index, globalSkills }: ProjectRoleCardProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isEditing = popoverOpen;
  
  const menuRef = useRef<HTMLDivElement>(null);

  // TODO Мок откликов

  const requests = {
    applications: [
      {
        applicationID: '123',
        studentID: '1234',
        roleID: '1',
        createdAt: "2026-08-06T10:52:00.281Z",
        status: 'Closed'
      },
      {
        applicationID: '123',
        studentID: '1234',
        roleID: '1',
        createdAt: "2026-08-06T10:52:00.281Z",
        status: 'Pending'
      },
      {
        applicationID: '123',
        studentID: '1234',
        roleID: '2',
        createdAt: "2026-08-06T10:52:00.281Z",
        status: 'Pending'
      },
      {
        applicationID: '123',
        studentID: '1234',
        roleID: '3',
        createdAt: "2026-08-06T10:52:00.281Z",
        status: 'Approved'
      },
      {
        applicationID: '123',
        studentID: '1234',
        roleID: '3',
        createdAt: "2026-08-06T10:52:00.281Z",
        status: 'Rejected'
      },
    ],
    total: 1,
    offset: 1,
    limit: 1
  }



  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <form.Field name={`roles[${index}]`} mode="value">
      {(roleField) => {
        const role = roleField.state.value;
        const roleName = role.meta.name || 'Роль';
        
        const roles = form.state.values.roles || [];
        const occurrenceIndex = roles.slice(0, index + 1).filter((r) => r.roleTypeId === role.roleTypeId).length;

        const handleRemoveRole = () => {
          setMenuOpen(false);
          form.removeFieldValue('roles', index);
        };

        const handleDuplicateRole = () => {
          setMenuOpen(false);
          form.insertFieldValue('roles', index + 1, {
            ...roleField.state.value,
            skills: roleField.state.value.skills ? [...roleField.state.value.skills] : []
          });
        };

        return (
          <div className={styles.cardWrapper}>
            <div className={styles.cardHeader}>
              <div className={styles.titleContainer}>
                <h4 className={styles.cardTitle}>
                  {index + 1}. {roleName}
                </h4>
                <p className={styles.required}>
                  *
                </p>
                <p className={styles.occurrenceIndex}>
                  {occurrenceIndex !== 1 && `(${occurrenceIndex})`}
                </p>
              </div>
              <div className={styles.moreMenuContainer} ref={menuRef}>
                {/*<label className={styles.checkboxLabel}>*/}
                {/*  Обязательная компетенция*/}
                {/*  <input type="checkbox" disabled />*/}
                {/*</label>*/}
                <button 
                  type="button" 
                  className={styles.moreMenuButton}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <MoreIcon/>
                </button>
                {menuOpen && (
                  <div className={styles.dropdownMenu}>
                    <button type="button" className={styles.dropdownItem} onClick={handleDuplicateRole}>
                      <CopyIcon/>
                      Дублировать компетенцию
                    </button>
                    <button type="button" className={styles.dropdownItem} onClick={handleRemoveRole}>
                      <DeleteIcon/>
                      Удалить компетенцию
                    </button>
                  </div>
                )}
              </div>
            </div>

            {popoverOpen && (
              <div className={styles.backdrop} onClick={() => setPopoverOpen(false)} style={{ zIndex: 10 }} />
            )}

            <div className={styles.cardBody}>
              <div
                className={`${styles.body} ${styles.relativeBody} ${isEditing ? styles.editingBorder : ''}`}
                style={{ zIndex: isEditing ? 11 : 1 }}
              >
                <div className={styles.mainContainer}>
                <span className={`${styles.skillsLabel} ${isEditing ? styles.skillsLabelEditing : ''}`}>
                  Требуемые навыки
                </span>

                  <form.Field name={`roles[${index}].skills`} mode="array">
                    {(skillsField) => {
                      const skills = skillsField.state.value || [];

                      const handleAddSkill = (skill: Skill) => {
                        if (!skills.find((s) => s.skillId === skill.skillId)) {
                          skillsField.pushValue({ skillId: skill.skillId, skillName: skill.skillName });
                        }
                      };

                      const handleRemoveSkill = (skillId: string) => {
                        skillsField.handleChange(skills.filter((s) => s.skillId !== skillId));
                      };

                      return (
                        <div className={styles.competenciesContainer}>
                          {skills.map((skill) => (
                            <div key={skill.skillId} className={`${styles.competency} ${isEditing ? styles.editing : ''}`}>
                              <div className={styles.featContainer}>
                                {skill.skillName}
                                {
                                  isEditing &&
                                  <>
                                    <button className={styles.featButton}>
                                      <EmptyStarIcon className={styles.starIcon}/>
                                    </button>
                                  </>
                                }

                              </div>

                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(skill.skillId)}
                                >
                                  <Cross className={styles.crossIcon} />
                                </button>
                              )}
                            </div>
                          ))}

                          {popoverOpen && (
                            <MyCompetenciesModal
                              currentFullSkills={globalSkills.filter(g => !skills.find((s) => s.skillId === g.skillId))}
                              addSkill={handleAddSkill}
                              setPopoverOpenFor={() => setPopoverOpen(false)}
                            />
                          )}
                        </div>
                      );
                    }}
                  </form.Field>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    className={styles.editButton}
                    onClick={() => setPopoverOpen(true)}
                  >
                    <Pencil className={styles.editIcon}/>
                  </button>
                )}
              </div>

              <div className={styles.requestBlock}>
                <RequestBlock requests={requests}/>
              </div>
            </div>
          </div>
        );
      }}
    </form.Field>
  );
}
