import styles from './MagicToggle.module.css';
// TODO ЭТОТ ПИЗДЕЦ УБРАТЬ
import { useFilterStore } from '@/features/filter/model/useFilterStore';
import StarSVG from '../icons/magic_star.svg?react'

interface MagicToggleProps {
  checked?: boolean
  initialChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}

export const MagicToggle = ({ 
  checked,
  onChange,
  disabled
} : MagicToggleProps) => {
  const storeIsRelevanceSort = useFilterStore(state => state.isRelevanceSort)
  const toggleIsRelevanceSort = useFilterStore(state => state.toggleIsRelevanceSort)

  const isChecked = checked !== undefined ? checked : storeIsRelevanceSort

  const handleToggle = () => {
    if (disabled) return

    const newValue = !isChecked
    onChange?.(newValue)
    if (checked === undefined) {
      toggleIsRelevanceSort(newValue)
    }
  }

  return (
    <button 
      type="button"
      role="switch"
      aria-checked={isChecked}
      className={`${styles.magicToggle} ${isChecked ? styles.checked : ''}`} 
      onClick={handleToggle}
    >
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="magicStarGradient" cx="35%" cy="35%" r="65%">
            <stop offset="23%" stopColor="#94FF47" />
            <stop offset="100%" stopColor="#00FF55" />
          </radialGradient>
        </defs>
      </svg>

      <StarSVG className={styles.star1} />
      <StarSVG className={styles.star2} />

      <div className={styles.toggleTrack}>
        <div className={styles.toggleThumb} />
      </div>
    </button>
  )
}