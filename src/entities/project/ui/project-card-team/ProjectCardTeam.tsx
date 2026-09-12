import { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './ProjectCardTeam.module.css';
import { Avatar, TeamUserCard } from '@/entities/user';
import { ProjectTeamPopup } from '../project-team-popup/ProjectTeamPopup';

export interface ProjectTeamMemberItem {
  id?: string | number;
  firstName: string;
  lastName: string;
  avatar?: string;
  profilePicture?: string;
  course?: string | number;
  roles?: string[];
}

export interface ProjectTeamMemberRowProps {
  member: ProjectTeamMemberItem;
  className?: string;
}

export const ProjectTeamMemberRow = ({ member }: ProjectTeamMemberRowProps) => {
  return (
    <TeamUserCard
      firstName={member.firstName}
      lastName={member.lastName}
      course={member.course}
      roles={member.roles}
      avatar={
        <Avatar
          picture={member.profilePicture || member.avatar}
          fallbackType="user"
          size="40px"
          strokeColor="white"
        />
      }
      nameTextStyle="bodyText"
      nameSubtextStyle="OS-10-400"
      nameStyle="normal"
    />
  );
};

export interface ProjectCardTeamProps {
  label?: string;
  members?: ProjectTeamMemberItem[];
  max?: number;
  className?: string;
  popupTitle?: string;
  emptyText?: string;
  children?: ReactNode;
}

export const ProjectCardTeam = ({
  label = 'Команда:',
  members,
  max,
  className,
  popupTitle = 'Команда проекта',
  // emptyText = 'Команда пока формируется',
  children,
}: ProjectCardTeamProps) => {
  // if (!members || members.length === 0) {
  //   return (
  //     <div className={clsx(styles.container, className)}>
  //       {label && <p className={styles.label}>{label}</p>}
  //       <p className={styles.emptyText}>{emptyText}</p>
  //     </div>
  //   );
  // }

  if (!members || members.length === 0) {
    return null;
  }

  const visibleMembers = max !== undefined && max > 0 ? members.slice(0, max) : members;
  const remainingCount = max !== undefined && max > 0 ? Math.max(0, members.length - max) : 0;

  const trigger = (
    <div className={styles.teamList}>
      {visibleMembers.map((member, index) => (
        <div key={member.id ?? index} className={styles.avatarWrapper}>
          <Avatar
            picture={member.profilePicture || member.avatar}
            fallbackType="user"
            size="36px"
            strokeColor="white"
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div className={styles.remainingBadge}>
          +{remainingCount}
        </div>
      )}
    </div>
  );

  return (
    <div className={clsx(styles.container, className)}>
      {label && <p className={styles.label}>{label}</p>}
      <ProjectTeamPopup title={popupTitle} trigger={trigger} triggerOn="hover">
        {children ?? (
          <div className={styles.defaultMemberList}>
            {members.map((member, index) => (
              <ProjectTeamMemberRow key={member.id ?? index} member={member} />
            ))}
          </div>
        )}
      </ProjectTeamPopup>
    </div>
  );
};
