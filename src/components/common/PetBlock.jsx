import styles from './PetBlock.module.css';

export default function PetBlock() {
  return (
    <div className={styles.wrap}>
      <div className={styles.imgBox}>
        <div className={styles.emoji}>🐾</div>
        <div className={styles.circles}>
          <div className={styles.c1} />
          <div className={styles.c2} />
          <div className={styles.c3} />
        </div>
        <p className={styles.tagline}>Find your perfect furry friend</p>
      </div>
    </div>
  );
}
