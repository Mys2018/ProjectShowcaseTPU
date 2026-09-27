import { useEffect, useMemo, useState } from 'react';
import styles from './SelectCompetencyModal.module.css';
import { useSkillsStore } from '@/features/my-competencies';
import { useCompetencies } from '@/entities/competency';
import { Checkbox, ModalFooter, Modal, Skeleton, TextSkeleton } from '@/shared';

interface SelectCompetencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxCount?: number;
  initialSelectedIds?: string[];
  onSubmitCallback?: (roles: { id: string; name: string }[]) => void;
}

export const SelectCompetencyModal = ({ isOpen, onClose, maxCount, initialSelectedIds, onSubmitCallback }: SelectCompetencyModalProps) => {
  const { draftData, setCompetencies } = useSkillsStore();
  const { data: roleTypesData = [], isLoading } = useCompetencies();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(initialSelectedIds ?? draftData.map((c) => c.roleTypeId));
    }
  }, [isOpen, draftData, initialSelectedIds]);

  const availableCompetencies = useMemo(() => {
    return Array.isArray(roleTypesData) ? roleTypesData : [];
  }, [roleTypesData]);

  const limit = maxCount ?? 7;

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= limit) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSubmit = () => {
    if (selectedIds.length === 0) return;
    const selectedRoles = availableCompetencies
      .filter((c) => selectedIds.includes(c.id))
      .map((c) => ({ id: c.id, name: c.name ?? '' }));
    
    if (onSubmitCallback) {
      onSubmitCallback(selectedRoles);
    } else {
      setCompetencies(selectedRoles);
    }
    onClose();
  };

  const title = selectedIds.length > 0 ? 'Добавьте или измените компетенции' : 'Выбор компетенций';
  const subtitle = `Выбрано ${selectedIds.length}/${limit}`;
  const errorMessage = selectedIds.length === 0 ? 'Выберите хотя бы 1 компетенцию' : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title={title} subtitle={subtitle} />

      <Modal.Body>
        {isLoading ? (
          <div className={styles.list} aria-busy="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                }}
              >
                <Skeleton width="18px" height="18px" borderRadius="4px" />
                <TextSkeleton width={`${40 + (i % 3) * 20}%`} height="16px" />
              </div>
            ))}
          </div>
        ) : availableCompetencies.length > 0 ? (
          <div className={styles.list}>
            {availableCompetencies.map((competency) => {
              const isChecked = selectedIds.includes(competency.id);
              const isDisabled = !isChecked && selectedIds.length >= limit;
              return (
                <Checkbox
                  className={styles.checkbox}
                  key={competency.id}
                  label={competency.name}
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => handleToggle(competency.id)}
                />
              );
            })}
          </div>
        ) : (
          <p style={{ color: 'var(--color-gray-500)', textAlign: 'center', padding: '20px 0' }}>
            Нет доступных компетенций
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <ModalFooter
          onClose={onClose}
          handleSubmit={handleSubmit}
          disabled={selectedIds.length === 0}
          error={errorMessage}
        />
      </Modal.Footer>
    </Modal>
  );
};