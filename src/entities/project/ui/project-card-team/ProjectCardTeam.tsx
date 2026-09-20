/* eslint-disable fsd/no-cross-slice-dependency */
/* eslint-disable fsd/forbidden-imports */
import { type ReactNode } from 'react';
import clsx from 'clsx';
import { ProjectTeamPopup } from '../project-team-popup/ProjectTeamPopup';
import styles from './ProjectCardTeam.module.css';
import { Avatar, getAvatarRoleInfo, getMemberRoleName, TeamUserCard, UserGroup, type ProjectLike, type UserCard } from '@/entities/user';

/** @deprecated Use UserCard from '@/entities/user' instead */
export type ProjectTeamMemberItem = UserCard;

export interface ProjectTeamMemberRowProps {
  member: UserCard;
  project?: ProjectLike;
  className?: string;
}

export const ProjectTeamMemberRow = ({ member, project }: ProjectTeamMemberRowProps) => {
  const memberRole = project ? getMemberRoleName(member.userId, project) : undefined;

  return (
    <TeamUserCard
      userId={member.userId}
      firstName={member.meta?.firstName || ''}
      lastName={member.meta?.lastName || ''}
      course={member.grade}
      roles={memberRole ? [memberRole] : member.roles}
      competency={memberRole}
      avatar={
        <Avatar
          userId={member.userId}
          picture={member.profilePicture || ''}
          fallbackType={getAvatarRoleInfo(member.roles)?.fallback || 'user'}
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
  project?: ProjectLike;
  children?: ReactNode;
}

export const ProjectCardTeam = ({
  label = 'Команда:',
  members,
  max,
  className,
  popupTitle = 'Команда проекта',
  project,
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
              <ProjectTeamMemberRow
                key={member.userId ?? index}
                member={member}
                project={project}
              />
            ))}
          </div>
        )}
      </ProjectTeamPopup>
    </div>
  );
};
