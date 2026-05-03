import { useState, useEffect } from 'react';
import styles from './Loader.module.css';

export default function Loader() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles['loader-overlay']}>
      <div className={styles.logo}>
        <span className={styles.logoText}>petl</span>
        <img src="/heart.svg" alt="" className={styles.heartIcon} />
        <span className={styles.logoText}>ve</span>
      </div>
      <div className={styles['progress-bar']}>
        <div
          className={styles['progress-fill']}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}