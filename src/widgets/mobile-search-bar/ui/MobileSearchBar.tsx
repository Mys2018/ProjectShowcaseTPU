import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import clsx from 'clsx'
import styles from './MobileSearchBar.module.css'
import { useFilterStore } from '@/features/filter'
import SearchIcon from '@/shared/assets/svg/SearchIcon.svg?react'
import FilterIcon from '@/shared/ui/icons/filter.svg?react'
import { useDebounce, useMobileChrome } from '@/shared/lib'


interface MobileSearchBarProps {
  onOpenFilters?: () => void
}


export function MobileSearchBar({ onOpenFilters }: MobileSearchBarProps) {
  const { pathname } = useLocation()
  const { searchTop, searchState, searchAnimate } = useMobileChrome(true, pathname)

  const query = useFilterStore(state => state.query)
  const setQuery = useFilterStore(state => state.setQuery)
  const projectTypes = useFilterStore(state => state.projectTypes)
  const tags = useFilterStore(state => state.tags)
  const competencies = useFilterStore(state => state.competencies)

  const hasActiveFilters = projectTypes.size > 0 || tags.size > 0 || competencies.size > 0

  const [localQuery, setLocalQuery] = useState(query)
  const debouncedQuery = useDebounce(localQuery.trim(), 500)

  useEffect(() => {
    if (query !== localQuery && (query === '' || query !== debouncedQuery)) {
      setLocalQuery(query)
    }
  }, [query])

  useEffect(() => setQuery(debouncedQuery), [debouncedQuery, setQuery])



  return (
    <div
      className={clsx(styles.dock, styles[searchState])}
      style={{
        transform: `translateY(${searchTop}px)`,
        transition: searchAnimate ? 'transform .3s ease' : 'none'
      }}
    >
      <div className={styles.card}>
        <label className={styles.searchBar}>
          <SearchIcon className={styles.searchIcon} />
          <input
            className={styles.input}
            type="text"
            placeholder="Вводите инфо о проекте"
            value={localQuery}
            onChange={e => setLocalQuery(e.target.value)}
          />
        </label>
        <button
          className={clsx(styles.filters, hasActiveFilters && styles.hasFilters)}
          type="button"
          aria-label="Фильтры"
          onClick={onOpenFilters}
        >
          <FilterIcon className={styles.filtersIcon} />
          {hasActiveFilters && <span className={styles.filterBadge} />}
        </button>
      </div>
    </div>
  )
}
