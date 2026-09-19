import { useFilterStore } from '@/features/filter/model/useFilterStore'
import styles from './SearchField.module.css'
import searchIcon from '../../assets/svg/SearchIcon.svg'
import { useDebounce } from '@/shared/lib'
import { useEffect, useState } from 'react'

export default function SearchField() {
  const { query, setQuery } = useFilterStore()

  const [localQuery, setLocalQuery] = useState(query)
  const debouncedQuery = useDebounce(localQuery.trim(), 500)

  useEffect(() => {
    if (query !== localQuery && (query === '' || query !== debouncedQuery)) {
      setLocalQuery(query)
    }
  }, [query])

  useEffect(() => {
    setQuery(debouncedQuery)
  }, [debouncedQuery, setQuery])

  return (
    <div className={styles.body}>
      <img className={styles.icon} src={searchIcon} alt='Поиск' />
      <input
        className={styles.input}
        type='text'
        placeholder='Вводите инфо о проекте'
        value={localQuery}
        onChange={e => setLocalQuery(e.target.value)}
      />
    </div>
  )
}

