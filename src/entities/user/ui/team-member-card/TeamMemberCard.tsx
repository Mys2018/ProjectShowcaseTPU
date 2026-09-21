import styles from './TeamMemberCard.module.css'
import { CompetencyIcon, isPseudoRole, type Competency } from '@/entities/competency';
import { Avatar, getAvatarRoleInfo, TeamUserCard, type UserCard, useUserById } from '@/entities/user';
import { SkillTagList, type Skill } from '@/entities/skill';
import StarPlusIcon from '@/shared/ui/icons/plus_star.svg?react'
import MoreIcon from '@/shared/ui/icons/more.svg?react'
import RemoveUserIcon from '@/shared/ui/icons/remove_user.svg?react'
import clsx from 'clsx';
import {InfoTooltip, PopupMenu} from "@/shared";

interface TeamMemberCardProps {
  user: UserCard;
  skills?: Skill[];
  competency?: Competency | string;
  role?: string;
  index?: number;
  name?: string;
  isRequired?: boolean;
  occurrenceIndex?: number;
  totalOccurrences?: number;
  className?: string;
  onRemove?: () => void;
  onScore?: () => void;
}

export const TeamMemberCard = ({
  user,
  skills = [],
  competency,
  role,
  index,
  name,
  isRequired,
  occurrenceIndex,
  totalOccurrences,
  className,
  onRemove,
  onScore,
}: TeamMemberCardProps) => {
  const { data: user_full } = useUserById(user.userId);

  const userCompetencyText = Array.isArray(user_full?.competencies)
    ? user_full.competencies.join(', ')
    : user_full?.competencies;

  const rawRole =
    role ||
    (typeof competency === 'string' ? competency : competency?.name) ||
    (name && !isPseudoRole(name) ? name : undefined) ||
    user.roles?.filter(r => !isPseudoRole(r)).join(', ') ||
    (userCompetencyText && !isPseudoRole(userCompetencyText) ? userCompetencyText : undefined) ||
    '';

  const cleanRole = isPseudoRole(rawRole) ? '' : rawRole;
  const title = (name && !isPseudoRole(name) ? name : undefined) || cleanRole || undefined;
  const showOccurrence =
    totalOccurrences !== undefined
      ? totalOccurrences > 1
      : occurrenceIndex !== undefined && occurrenceIndex !== 1;

  return (
    <div className={clsx(styles.cardWrapper, className)}>
      {title && (
        <div className={styles.cardHeader}>
          <div className={styles.titleContainer}>
            <h4 className={styles.cardTitle}>
              {index !== undefined ? `${index + 1}. ` : ''}{title}
            </h4>
            {isRequired && <p className={styles.required}>*</p>}
            {showOccurrence && (
              <p className={styles.occurrenceIndex}>({occurrenceIndex})</p>
            )}
          </div>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.leftBlock}>
          <CompetencyIcon role={cleanRole} className={styles.competencyIcon} />
          <div className={styles.skills}>
            <p className={styles.skillsTitle}>
              Требуемые навыки
            </p>
            <SkillTagList skills={skills} />
          </div>
        </div>
        <div className={styles.rightBlock}>
          <TeamUserCard
            userId={user.userId}
            avatar={
              <Avatar
                userId={user.userId}
                picture={user.profilePicture}
                fallbackType={getAvatarRoleInfo(user.roles)?.fallback || 'user'}
                size="48px"
                strokeColor="grey"
              />
            }
            firstName={user.meta.firstName}
            lastName={user.meta.lastName}
            nameTextStyle="bodyText"
            nameSubtextStyle="OS-12-350"
            nameStyle="normal"
            course={user_full?.grade}
            competency={cleanRole}
          />
          <div className={styles.buttonContainer}>
            <InfoTooltip body={[
              {
                text: [
                  'Оцените вклад участника в проект',
                ]
              },
            ]} size={"small"} pointer={"topLeft"}>
              <button className={styles.toScore} onClick={onScore}>
                <StarPlusIcon/>
              </button>
            </InfoTooltip>
            <PopupMenu trigger={
              <button className={styles.more}>
                <MoreIcon/>
              </button>
            }>
              <PopupMenu.Row title={'Исключить пользователя'} onClick={onRemove || (() => {})}>
                <RemoveUserIcon/>
              </PopupMenu.Row>
              <PopupMenu.Row title={'Оценить работу участника'} onClick={onScore || (() => {})}>
                <StarPlusIcon/>
              </PopupMenu.Row>
            </PopupMenu>
          </div>

        </div>
      </div>
    </div>
  );
};
