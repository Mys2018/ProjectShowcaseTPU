import { useState } from 'react';

import styles from './InviteUserModal.module.css';
import { Modal } from '@/shared/ui/modals/modal/Modal.tsx';
import SadIcon from '@/shared/ui/icons/sad_face.svg?react';
import CrossIcon from '@/shared/ui/icons/cross.svg?react';
import {TeamUserCard} from "@/shared/ui/team_user_card/TeamUserCard.tsx";
import {InviteActionButton} from "@/shared/ui/elements/buttons";
import {SmallSearchField} from "@/shared/ui/small-search-field";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string;
  onInvite?: (user: { id: number; name: string}) => void;
}

const MOCK_USERS = [
  { id: 1, name: 'Константинопольский Константин Константинович'},
  { id: 2, name: 'Константинопольский Константин Константинович'},
  { id: 3, name: 'Андрей Парашют'},
  { id: 4, name: 'Иван Иванов'},
  { id: 5, name: 'Иван Иванов'},
  { id: 6, name: 'Иван Иванов'},
  { id: 7, name: 'Иван Иванов'},
  { id: 8, name: 'Иван Иванов'},
  { id: 9, name: 'Иван Иванов'},
  { id: 10, name: 'Иван Иванов'},

];

export const InviteUserModal = ({ isOpen, onClose, roleName }: InviteUserModalProps) => {
  const [query, setQuery] = useState('');

  const filteredUsers = query
    ? MOCK_USERS.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.id.toString().includes(query))
    : [];

  // const handleSelect = (user: { id: number; name: string}) => {
  //   onInvite(user);
  //   onClose();
  // };

  const clearQuery = () => {
    setQuery('');
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="transparent">
      <div className={styles.topBlock}>
        <div className={styles.header}>
          <h2 className={styles.title}>Пригласить пользователя в компетенцию {roleName}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <CrossIcon className={styles.closeIcon} />
          </button>
        </div>

        <SmallSearchField placeholder={"Константинопольский Константин Константинович"} value={query} onChange={(e) => setQuery(e.target.value)}/>
      </div>

      {(query && filteredUsers.length > 0) ? (
        <div className={styles.bottomBlock}>
          <div className={styles.scrollContainer}>
            {filteredUsers.map((user, index) => (
              <div key={user.id}>
                <div className={styles.userCard}>
                  <TeamUserCard
                    avatar_size='40px'
                    name={user.name}
                    course={"3"}
                    roles={['Backend', 'Frontend']}
                  />
                  <InviteActionButton type={'Invite'}/>
                </div>
                {index < filteredUsers.length - 1 && <div className={styles.divider} />}
              </div>
            ))}
          </div>
        </div>
      ) : query ? (
        <div className={styles.bottomBlock}>
          <SadIcon/>
          <div className={styles.emptyBlock} onClick={clearQuery}>
            <p className={styles.emptyState}>Пользователей с таким именем не найдено</p>
            <button>
              Очистить поиск
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};
