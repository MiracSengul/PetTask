import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <main className={`page ${styles.page}`}>
      <div className="container">
        <div className={styles.hero}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              Take good<br />
              <span className={styles.accent}>care</span> of your<br />
              small pets 🐾
            </h1>
            <p className={styles.desc}>
              Petlove is the best place to find a new friend. Browse notices, 
              read news, and connect with pet lovers around you.
            </p>
            <div className={styles.btnGroup}>
              <Link to="/notices" className="btn btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
                Find pets →
              </Link>
              <Link to="/news" className="btn btn-outline" style={{ fontSize: 15, padding: '14px 32px' }}>
                Read news
              </Link>
            </div>
          </div>
          <div className={styles.imgWrap}>
            <div className={styles.blob}>
              <div className={styles.emoji}>🐕</div>
              <div className={styles.emoji2}>🐈</div>
              <div className={styles.emoji3}>🐇</div>
            </div>
          </div>
        </div>

        <div className={styles.features}>
          {[
            { icon: '📰', title: 'News', desc: 'Stay up to date with the latest pet news', to: '/news' },
            { icon: '📋', title: 'Notices', desc: 'Browse and post pet adoption notices', to: '/notices' },
            { icon: '🤝', title: 'Our Friends', desc: 'Discover partner pet organizations', to: '/friends' },
          ].map((f) => (
            <Link key={f.title} to={f.to} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className={styles.featureArrow}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
