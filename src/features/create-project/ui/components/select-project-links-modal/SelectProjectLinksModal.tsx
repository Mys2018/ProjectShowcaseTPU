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
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedNames(initialSelected);
      setShowErrors(false);
    }
  }, [isOpen, initialSelected]);

  const limit = maxCount;

  const handleToggle = (name: string) => {
    setShowErrors(false);
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

  const getRequiredGroupsMissing = () => {
    return PROJECT_LINKS_MOCK
      .filter(group => group.required)
      .filter(group => !group.links.some(link => selectedNames.includes(link.name)));
  };

  const isRequiredMet = getRequiredGroupsMissing().length === 0;

  const isGroupMissing = (category: string) => {
    return showErrors && getRequiredGroupsMissing().some(g => g.category === category);
  };

  const handleSubmit = () => {
    if (!isRequiredMet) {
      setShowErrors(true);
      return;
    }
    const result = selectedNames.map(name => ({ name, link: '' }));
    onConfirm(result);
    onClose();
  };

  const title = selectedNames.length > 0 ? 'Добавьте или измените ссылки' : 'Добавьте ссылки';
  const subtitle = `Выбрано ${selectedNames.length}/${limit}`;

  const errorMessage = showErrors && !isRequiredMet
    ? 'Выберите хотя бы по одной ссылке из обязательных блоков'
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title={title} subtitle={subtitle} />

      <Modal.Body>
        <div className={styles.list}>
          {PROJECT_LINKS_MOCK.map((group) => (
            <div key={group.category} className={`${styles.group} ${isGroupMissing(group.category) ? styles.groupError : ''}`}>
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
                      paddings={'12px'}
                      key={link.name}
                      label={link.name}
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={() => handleToggle(link.name)}
                    />
                  );
                })}
              </div>
              {isGroupMissing(group.category) && (
                <span className={styles.groupErrorText}>Выберите хотя бы одну ссылку</span>
              )}
            </div>
          ))}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <ModalFooter
          onClose={onClose}
          handleSubmit={handleSubmit}
          disabled={selectedNames.length === 0}
          error={errorMessage}
        />
      </Modal.Footer>
    </Modal>
  );
};

