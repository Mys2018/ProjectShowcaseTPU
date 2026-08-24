import { useState } from 'react';
import styles from './MagicToggle.module.css';
import { useFilterStore } from '@/features/filter/model/useFilterStore';

interface MagicToggleProps {
  initialChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean
}

export const MagicToggle = ({ 
  initialChecked = false, 
  onChange,
  disabled
} : MagicToggleProps) => {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const { toggleIsRelevanceSort } = useFilterStore()

  const handleToggle = () => {

    if (disabled) return

    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
    toggleIsRelevanceSort(newValue)
  };


  return (
    <button 
      type="button"
      role="switch"
      aria-checked={isChecked}
      className={`${styles.magicToggle} ${isChecked ? styles.checked : ''}`} 
      onClick={handleToggle}
    >
      <div className={styles.toggleTrack}>
        <div className={styles.toggleThumb} />
      </div>
    </button>
  );
};