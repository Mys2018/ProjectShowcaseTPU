import { Modal } from '@/shared/ui/modal/Modal.tsx';
import { useState } from 'react';
import SearchIcon from '@/assets/svg/SearchIcon.svg?react';
import CrossIcon from '@/shared/ui/icons/cross.svg?react';
import UserIcon from '@/shared/ui/icons/fallback_personal.svg?react';
import styles from './InviteUserModal.module.css';
import {TeamUserCard} from "@/shared/ui/team_user_card/TeamUserCard.tsx";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string;
  onInvite: (user: { id: number; name: string, status: string }) => void;
}

const MOCK_USERS = [
  { id: 1, name: 'Константинопольский Константин Константинович', status: 'Approved' },
  { id: 2, name: 'Константинопольский Константин Константинович', status: 'Closed' },
  { id: 3, name: 'Андрей Парашют', status: 'Pending' },
  { id: 4, name: 'Иван Иванов', status: 'Rejected' },
];

export const InviteUserModal = ({ isOpen, onClose, roleName, onInvite }: InviteUserModalProps) => {
  const [query, setQuery] = useState('');

  const filteredUsers = query
    ? MOCK_USERS.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.id.toString().includes(query))
    : [];

  const handleSelect = (user: { id: number; name: string; status: string }) => {
    onInvite(user);
    onClose();
  };

  const renderActionButton = (type: string) => {
    switch (type) {
      case 'Invite':
        return <button className={styles.inviteBtn}>Пригласить</button>;
      case 'InviteRejected':
        return <button className={styles.inviteRejectedBtn}>Приглашение отклонено</button>;
      case 'AlreadyInCommand':
        return <button className={styles.alreadyInCommandBtn}>Уже в команде</button>;
      case 'FeedbackResponse':
        return <button className={styles.feedbackResponseBtn}>Уже откликнулся</button>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="transparent">
      <div className={styles.topBlock}>
        <div className={styles.header}>
          <h2 className={styles.title}>Пригласить пользователя в компетенцию {roleName}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <CrossIcon className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.searchWrapper}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Константинопольский Константин Константинович"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {(query && filteredUsers.length > 0) ? (
        <div className={styles.bottomBlock}>
          {filteredUsers.map((user, index) => (
            <div key={user.id}>
              <div className={styles.userCard}>
                <TeamUserCard
                  avatar_size='40px'
                  name={user.name}
                  course={"3"}
                  roles={['Backend', 'Frontend']}
                />
                {renderActionButton('Invite')}
                {/*{renderActionButton('InviteRejected')}*/}
                {/*{renderActionButton('AlreadyInCommand')}*/}
                {/*{renderActionButton('FeedbackResponse')}*/}
              </div>
              {index < filteredUsers.length - 1 && <div className={styles.divider} />}
            </div>
          ))}
        </div>
      ) : query ? (
        <div className={styles.bottomBlock}>
          <p className={styles.emptyState}>Пользователь не найден</p>
        </div>
      ) : null}
    </Modal>
  );
};
