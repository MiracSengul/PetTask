import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.box}>
        <div className={styles.code}>
          <span>4</span>
          <div className={styles.zeroWrap}>
            <img src="/404cat.png" alt="cat" className={styles.catImg} />
          </div>
          <span>4</span>
        </div>
        <p className={styles.text}>Ooops! This page not found :(</p>
        <Link to="/home" className={styles.btn}>To home page</Link>
      </div>
    </main>
  );
}