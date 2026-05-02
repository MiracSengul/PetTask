import { useState } from 'react';
import styles from './SearchField.module.css';

export default function SearchField({ onSearch, placeholder = 'Ara...' }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.wrap}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
        />
        {value && (
          <button type="button" className={styles.clearBtn} onClick={handleClear} aria-label="Temizle">
            ✕
          </button>
        )}
        <button type="submit" className={styles.searchBtn} aria-label="Ara">
          🔍
        </button>
      </div>
    </form>
  );
}
