/* eslint-disable fsd/no-cross-slice-dependency */
/* eslint-disable fsd/forbidden-imports */
import { type ReactNode } from 'react';
import clsx from 'clsx';
import { ProjectTeamPopup } from '../project-team-popup/ProjectTeamPopup';
import styles from './ProjectCardTeam.module.css';
import { Avatar, TeamUserCard, UserGroup, type UserCard } from '@/entities/user';

/** @deprecated Use UserCard from '@/entities/user' instead */
export type ProjectTeamMemberItem = UserCard;

export interface ProjectTeamMemberRowProps {
  member: UserCard;
  className?: string;
}

export const ProjectTeamMemberRow = ({ member }: ProjectTeamMemberRowProps) => {
  return (
    <TeamUserCard
      firstName={member.meta?.firstName || ''}
      lastName={member.meta?.lastName || ''}
      course={member.grade}
      roles={member.roles}
      avatar={
        <Avatar
          picture={member.profilePicture || ''}
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
  members?: UserCard[];
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
  children,
}: ProjectCardTeamProps) => {
  if (!members || members.length === 0) {
    return null;
  }

  const trigger = (
    <UserGroup users={members} visibleCount={max} />
  );

  return (
    <div className={clsx(styles.container, className)}>
      {label && <p className={styles.label}>{label}</p>}
      <ProjectTeamPopup title={popupTitle} trigger={trigger} triggerOn="hover">
        {children ?? (
          <div className={styles.defaultMemberList}>
            {members.map((member, index) => (
              <ProjectTeamMemberRow key={member.userId ?? index} member={member} />
            ))}
          </div>
        )}
      </ProjectTeamPopup>
    </div>
  );
};
