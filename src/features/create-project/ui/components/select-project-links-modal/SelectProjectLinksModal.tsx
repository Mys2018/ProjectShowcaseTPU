import { Modal } from '@/shared/ui/modal/Modal.tsx';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/shared/ui/fields/checkbox/Checkbox.tsx';
import { ModalFooter } from '@/shared/ui/modal-footer/ModalFooter.tsx';
import styles from './SelectProjectLinksModal.module.css';

interface SelectProjectLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxCount?: number;
  initialSelected?: string[];
  onConfirm: (selectedLinks: { name: string; link: string }[]) => void;
}

const PROJECT_LINKS_MOCK = [
  {
    category: 'Репозиторий',
    required: true,
    links: [
      { name: 'GitHub' },
      { name: 'GitLab' },
      { name: 'GitVerse' },
    ]
  },
  {
    category: 'Таск-трекеры',
    required: true,
    links: [
      { name: 'Trello' },
      { name: 'Jira' },
      { name: 'Kaiten' },
    ]
  },
  {
    category: 'Дизайн-среда',
    required: false,
    links: [
      { name: 'Figma' },
    ]
  }
];

export const SelectProjectLinksModal = ({ isOpen, onClose, maxCount = 5, initialSelected = [], onConfirm }: SelectProjectLinksModalProps) => {
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedNames(initialSelected);
    }
  }, [isOpen, initialSelected]);

  const limit = maxCount;

  const handleToggle = (name: string) => {
    setSelectedNames((prev) => {
      if (prev.includes(name)) {
        return prev.filter((item) => item !== name);
      }
      if (prev.length >= limit) {
        return prev;
      }
      return [...prev, name];
    });
  };

  const handleSubmit = () => {
    const result = selectedNames.map(name => ({ name, link: '' }));
    onConfirm(result);
    onClose();
  };

  const title = selectedNames.length > 0 ? 'Добавьте или измените ссылки' : 'Добавьте ссылки';
  const subtitle = `Выбрано ${selectedNames.length}/${limit}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title={title} subtitle={subtitle} />

      <Modal.Body>
        <div className={styles.list}>
          {PROJECT_LINKS_MOCK.map((group) => (
            <div key={group.category} className={styles.group}>
              <h4 className={styles.groupTitle}>
                {group.category}
                {group.required && <span className={styles.required}>*</span>}
              </h4>
              <div className={styles.groupLinks}>
                {group.links.map((link) => {
                  const isChecked = selectedNames.includes(link.name);
                  const isDisabled = !isChecked && selectedNames.length >= limit;
                  return (
                    <Checkbox
                      key={link.name}
                      label={link.name}
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={() => handleToggle(link.name)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <ModalFooter
          onClose={onClose}
          handleSubmit={handleSubmit}
          disabled={selectedNames.length === 0}
          error={null}
        />
      </Modal.Footer>
    </Modal>
  );
};
