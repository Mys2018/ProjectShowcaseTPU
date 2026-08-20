import { useState } from 'react';
import type { CreateProjectForm } from '../../../model/useProjectWizard.ts';
import styles from './ProjectRoleCard.module.css';
import type { Skill } from '@/features/my-competencies/model/types.ts';
// import FullStarIcon from '@/shared/ui/icons/full_star.svg?react';
import { MyCompetenciesModal } from '@/features/my-competencies/ui/MyCompetenciesModal.tsx';
import Cross from '@/shared/ui/icons/cross.svg?react';
import Pencil from '@/shared/ui/icons/pencil.svg?react';
import MoreIcon from '@/shared/ui/icons/more.svg?react';
import CopyIcon from '@/shared/ui/icons/copyCompetency.svg?react';
import DeleteIcon from '@/shared/ui/icons/fillDelete.svg?react';
import EmptyStarIcon from '@/shared/ui/icons/empty_star.svg?react';
import { useModalStore } from '@/shared/model';
import AddUserIcon from '@/shared/ui/icons/addUser.svg?react';
import {PopupMenu} from "@/shared/ui/popup-menu/PopupMenu.tsx";
import {Checkbox} from "@/shared";

interface ProjectRoleCardProps {
  form: CreateProjectForm;
  index: number;
  globalSkills: Skill[];
}

export function ProjectRoleCard({ form, index, globalSkills }: ProjectRoleCardProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isEditing = popoverOpen;

  const { openModal } = useModalStore();

  // const [mockIsPublished, setMockIsPublished] = useState(false);

  const mockIsPublished = false
  const [invitedUser, setInvitedUser] = useState<{ id: number; name: string } | null>(null);

  const inviteUser = (roleName: string) => {
    openModal('INVITE_USER', {
      roleName: roleName,
      onInvite: (user: { id: number; name: string }) => setInvitedUser(user),
    });
  }

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
              <div className={styles.moreMenuContainer}>
                <label className={styles.checkboxLabel}>
                  Обязательная компетенция
                  <Checkbox/>
                </label>
                <PopupMenu
                  trigger={<button
                    type="button"
                    className={styles.moreMenuButton}
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <MoreIcon/>
                  </button>}
                >
                  <PopupMenu.Row onClick={handleDuplicateRole} title={'Дублировать компетенцию'}>
                    <CopyIcon/>
                  </PopupMenu.Row>

                  <PopupMenu.Row onClick={handleRemoveRole} title={'Удалить компетенцию'}>
                    <DeleteIcon/>
                  </PopupMenu.Row>
                  {
                    !invitedUser &&
                    <PopupMenu.Row onClick={() => inviteUser(roleName)} title={'Пригласить пользователя'}>
                      <AddUserIcon/>
                    </PopupMenu.Row>
                  }
                </PopupMenu>
              </div>
            </div>

            {popoverOpen && (
              <div className={styles.backdrop} onClick={() => setPopoverOpen(false)}/>
            )}

            <div className={styles.cardBody}>
              <div
                className={`${styles.body} ${styles.relativeBody} ${isEditing ? styles.editingBorder : ''}`}
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
                <div className={styles.innerContainer}>
                  {!mockIsPublished && (
                      <div className={styles.unpublishContainer}>
                        <p className={styles.fieldText}>Ожидает публикации проекта</p>
                        {
                          !invitedUser && <button
                            className={styles.inviteUserBtn}
                            onClick={() => inviteUser(roleName)}
                          >
                            <AddUserIcon className={styles.inviteIcon} />
                            Пригласить пользователя
                          </button>
                        }
                        {
                          invitedUser &&
                          <div className={styles.invitedInfo}>
                            <p className={styles.invitedName}>
                              <div>
                                Приглашен:
                                <span>{invitedUser?.name}</span>
                              </div>
                            </p>
                            <button className={styles.cancelInviteBtn} onClick={() => setInvitedUser(null)}>Отменить</button>
                          </div>
                        }

                      </div>
                    )
                  }
                  {
                    mockIsPublished &&
                    <div className={styles.publishedBlock}>
                      {
                        !invitedUser &&
                        <div className={styles.publishedHeader}>
                          <p className={styles.fieldText}>Компетенция свободна</p>
                          <button className={styles.iconBtn} onClick={() => inviteUser(roleName)}>
                            <AddUserIcon className={styles.inviteIconOnly} />
                          </button>
                        </div>
                      }
                      {
                        invitedUser &&
                        <div className={styles.invitedInfo}>
                          <p className={styles.invitedName}>
                            <div>
                              Приглашен:
                              <span>{invitedUser?.name}</span>
                            </div>
                          </p>
                          <button className={styles.cancelInviteBtn} onClick={() => setInvitedUser(null)}>Отменить</button>
                        </div>
                      }
                      <button className={styles.allFeedback}>
                        {
                          'Откликов: 5'
                        }
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </form.Field>
  );
}
