import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import clsx from 'clsx'
import styles from './MobileSearchBar.module.css'
import { useFilterStore } from '@/features/filter'
import SearchIcon from '@/shared/assets/svg/SearchIcon.svg?react'
import { useDebounce, useMobileChrome } from '@/shared/lib'

export function MobileSearchBar() {
  const { pathname } = useLocation()
  const { searchTop, searchState, searchAnimate } = useMobileChrome(true, pathname)

  const setQuery = useFilterStore(state => state.setQuery)
  const [localQuery, setLocalQuery] = useState('')
  const debouncedQuery = useDebounce(localQuery.trim(), 500)

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
        {/* ponytail: экрана фильтров на мобилке ещё нет, кнопка без действия */}
        <button className={styles.filters} type="button" aria-label="Фильтры">
          <span className={styles.filtersIcon} />
        </button>
      </div>
    </div>
  )
}
