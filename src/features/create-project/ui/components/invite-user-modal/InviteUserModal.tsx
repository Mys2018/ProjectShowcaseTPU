import { useEffect, useMemo, useState } from 'react';
import styles from './InviteUserModal.module.css';
import { TeamUserCard } from "@/entities/user/ui/team_user_card/TeamUserCard.tsx";
import { useSearchUsers } from "@/entities/user";
import { useProjects } from "@/entities/project";
import type { Application } from "@/entities/application";
import {Avatar} from "@/entities/user/ui/avatar";
import { Modal } from '@/shared/ui/modals/modal/Modal.tsx';
import SadIcon from '@/shared/ui/icons/sad_face.svg?react';
import CrossIcon from '@/shared/ui/icons/cross.svg?react';
import { InviteActionButton, type InviteActionButtonType } from "@/shared/ui/elements/buttons";
import { SmallSearchField } from "@/shared/ui/small-search-field";
import { useDebounce } from "@/shared/lib";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string;
  roleId?: string;
  projectId?: string;
  teamUserIds?: number[];
  applications?: Application[];
  onInvite?: (user: { id: number; name: string}) => void;
  onAcceptApplication?: (applicationId: string) => void;
}

export const InviteUserModal = ({
  isOpen,
  onClose,
  roleName,
  roleId,
  projectId,
  teamUserIds,
  applications,
  onInvite,
  onAcceptApplication,
}: InviteUserModalProps) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query.trim(), 300);

  const { data: allProjectsData } = useProjects({ limit: 100 }, isOpen);
  const allProjects = allProjectsData?.projects ?? [];

  const occupiedUserIdsInOtherProjects = useMemo(() => {
    const set = new Set<number>();
    for (const p of allProjects) {
      if (projectId && String(p.id) === String(projectId)) {
        continue;
      }
      if (p.status === 'Rejected' || p.status === 'NotImplemented' || p.status === 'Completed' || p.status === 'Archived') {
        continue;
      }
      for (const role of p.roles ?? []) {
        for (const uid of role.placeUserIds ?? []) {
          set.add(uid);
        }
      }
    }
    return set;
  }, [allProjects, projectId]);

  const currentTeamSet = useMemo(() => new Set(teamUserIds ?? []), [teamUserIds]);

  const { data, isLoading } = useSearchUsers(debouncedQuery, {
    enabled: isOpen && Boolean(debouncedQuery),
  });

  const users = data?.users ?? [];

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return [];
    if (query.trim() === debouncedQuery) {
      return users;
    }
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        u.meta.name.toLowerCase().includes(q) ||
        u.id.includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, query, debouncedQuery]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const clearQuery = () => {
    setQuery('');
  };

  const hasSearch = Boolean(query.trim());
  const isSearching = hasSearch && (isLoading || query.trim() !== debouncedQuery);

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="transparent">
      <div className={styles.topBlock}>
        <div className={styles.header}>
          <h2 className={styles.title}>Пригласить пользователя в компетенцию {roleName}</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <CrossIcon className={styles.closeIcon} />
          </button>
        </div>

        <SmallSearchField
          placeholder="Введите имя или фамилию пользователя"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {hasSearch && (
        <div className={styles.bottomBlock}>
          {isSearching && filteredUsers.length === 0 ? (
            <p className={styles.emptyState}>Поиск пользователей...</p>
          ) : filteredUsers.length > 0 ? (
            <div className={styles.scrollContainer}>
              {filteredUsers.map((user, index) => {
                const competencies = user.competencies ?? [];
                const candidateId = Number(user.id);

                // 1. Приглашение отклонено для этой роли
                const hasRejectedInvitation = Boolean(
                  applications?.some(
                    (a) =>
                      a.studentID === candidateId &&
                      (!roleId || a.roleID === roleId) &&
                      a.applicationType === 'Invitation' &&
                      a.status === 'rejected'
                  )
                );

                // 2. Уже в команде текущего проекта или любого другого активного проекта
                const isAlreadyInTeam =
                  currentTeamSet.has(candidateId) ||
                  occupiedUserIdsInOtherProjects.has(candidateId);

                // 3. Прямой отклик на эту компетенцию
                const matchingApplication = applications?.find(
                  (a) =>
                    a.studentID === candidateId &&
                    (!roleId || a.roleID === roleId) &&
                    a.applicationType === 'Application' &&
                    a.status === 'pending'
                );

                let buttonType: InviteActionButtonType = 'Invite';
                let handleAction: (() => void) | undefined;

                if (hasRejectedInvitation) {
                  buttonType = 'InviteRejected';
                } else if (isAlreadyInTeam) {
                  buttonType = 'AlreadyInCommand';
                } else if (matchingApplication) {
                  buttonType = 'FeedbackResponse';
                  handleAction = () => {
                    onAcceptApplication?.(matchingApplication.applicationID);
                    onClose();
                  };
                } else {
                  buttonType = 'Invite';
                  handleAction = () => {
                    onInvite?.({ id: candidateId, name: user.meta.name });
                    onClose();
                  };
                }

                return (
                  <div key={user.id}>
                    <div className={styles.userCard}>
                      <TeamUserCard
                        userId={user.id}
                        firstName={user.meta.firstName}
                        lastName={user.meta.lastName}
                        course={user.grade}
                        roles={competencies}
                        nameStyle={'normal'}
                        nameTextStyle={'bodyText'}
                        nameSubtextStyle={"OS-12-350"}
                        avatar={
                          <Avatar userId={user.id} picture={user.profilePicture} fallbackType={'user'} size={'48px'} strokeColor={'grey'}/>
                        }
                      />

                      <InviteActionButton
                        type={buttonType}
                        onClick={handleAction}
                      />
                    </div>
                    {index < filteredUsers.length - 1 && <div className={styles.divider} />}
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <SadIcon />
              <div className={styles.emptyBlock} onClick={clearQuery}>
                <p className={styles.emptyState}>Пользователей с таким именем не найдено</p>
                <button type="button">Очистить поиск</button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};
