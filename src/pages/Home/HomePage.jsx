import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <main className={styles.page}>
      {/* Balon + Resim konteyneri */}
      <div className={styles.balloonContainer}>
        {/* Sarı balon */}
        <div className={styles.balloon}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Take good <span className={styles.accent}>care</span> of your
              <br />
              small pets
            </h1>
            <p className={styles.heroDesc}>
              Choosing a pet for your home is a choice that is meant to enrich
              your life with immeasurable joy and tenderness.
            </p>
          </div>
        </div>

        {/* Köpek ve kadın resmi */}
        <div className={styles.imageSection}>
          <img
            src="/dogandwoman.png"
            alt="Woman with dog"
            className={styles.heroImage}
          />
        </div>
      </div>
    </main>
  );
}