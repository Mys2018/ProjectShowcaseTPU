import { Modal } from '@/shared/ui/modals/modal/Modal.tsx';
import { useEffect, useState, useMemo } from 'react';
import { Checkbox } from '@/shared/ui/fields/checkbox/Checkbox.tsx';
import { ModalFooter } from '@/shared/ui/modals/modal-footer/ModalFooter.tsx';
import styles from './SelectProjectLinksModal.module.css';
import {usePlatforms} from "@/entities/platforms/api/queries.ts";
import type {Category, Platform} from "@/entities/platforms/model/types.ts";

interface SelectProjectLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxCount?: number;
  initialSelected?: Platform[];
  onConfirm: (selectedLinks: Platform[]) => void;
}

const CATEGORY_CONFIG: Record<Category, { title: string; required: boolean }> = {
  Repository: { title: 'Репозиторий', required: true },
  TaskTracker: { title: 'Таск-трекеры', required: true },
  DesignEnvironment: { title: 'Дизайн-среда', required: false },
};

export const SelectProjectLinksModal = ({ isOpen, onClose, maxCount = 5, initialSelected = [], onConfirm }: SelectProjectLinksModalProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const { data: platformsData } = usePlatforms();

  const projectLinks = useMemo(() => {
    if (!platformsData) return [];
    
    return platformsData.map(group => {
      const config = CATEGORY_CONFIG[group.category] || { title: group.category, required: false };
      return {
        categoryKey: group.category,
        category: config.title,
        required: config.required,
        links: group.platforms
      };
    });
  }, [platformsData]);

  useEffect(() => {
    if (isOpen) {
      setSelectedPlatforms(initialSelected);
      setShowErrors(false);
    }
  }, [isOpen, initialSelected]);

  const limit = maxCount;

  const handleToggle = (platform: Platform) => {
    setShowErrors(false);
    setSelectedPlatforms((prev) => {
      const exists = prev.some(p => p.platformId === platform.platformId);
      if (exists) {
        return prev.filter((item) => item.platformId !== platform.platformId);
      }
      if (prev.length >= limit) {
        return prev;
      }
      return [...prev, platform];
    });
  };

  const getRequiredGroupsMissing = () => {
    return projectLinks
      .filter(group => group.required)
      .filter(group => !group.links.some(link => selectedPlatforms.some(sp => sp.platformId === link.platformId)));
  };

  const isRequiredMet = getRequiredGroupsMissing().length === 0;

  const isGroupMissing = (categoryTitle: string) => {
    return showErrors && getRequiredGroupsMissing().some(g => g.category === categoryTitle);
  };

  const handleSubmit = () => {
    if (!isRequiredMet) {
      setShowErrors(true);
      return;
    }
    onConfirm(selectedPlatforms);
    onClose();
  };

  const title = selectedPlatforms.length > 0 ? 'Добавьте или измените ссылки' : 'Добавьте ссылки';
  const subtitle = `Выбрано ${selectedPlatforms.length}/${limit}`;

  const errorMessage = showErrors && !isRequiredMet
    ? 'Выберите хотя бы по одной ссылке из обязательных блоков'
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title={title} subtitle={subtitle} />

      <Modal.Body>
        <div className={styles.list}>
          {projectLinks.map((group) => (
            <div key={group.categoryKey} className={`${styles.group} ${isGroupMissing(group.category) ? styles.groupError : ''}`}>
              <h4 className={styles.groupTitle}>
                {group.category}
                {group.required && <span className={styles.required}>*</span>}
              </h4>
              <div className={styles.groupLinks}>
                {group.links.map((link) => {
                  const isChecked = selectedPlatforms.some(sp => sp.platformId === link.platformId);
                  const isDisabled = !isChecked && selectedPlatforms.length >= limit;
                  return (
                    <Checkbox
                      className={styles.checkbox}
                      key={link.platformId}
                      label={link.name}
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={() => handleToggle(link)}
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
          disabled={selectedPlatforms.length === 0}
          error={errorMessage}
        />
      </Modal.Footer>
    </Modal>
  );
};

