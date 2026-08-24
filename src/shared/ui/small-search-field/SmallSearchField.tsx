import styles from './SmallSearchField.module.css'
import SearchIcon from '@/shared/ui/icons/SearchIcon.svg?react';
import React from "react";

interface SmallSearchFieldProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SmallSearchField = ({placeholder, value, onChange}: SmallSearchFieldProps) => {
  return (
    <div className={styles.searchWrapper}>
      <SearchIcon className={styles.searchIcon} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
