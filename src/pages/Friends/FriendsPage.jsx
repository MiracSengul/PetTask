import { useState, useEffect } from 'react';
import Title from '../../components/common/Title';
import api from '../../api/api';
import styles from './FriendsPage.module.css';

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/friends').then((r) => {
      setFriends(r.data.results || r.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const getToday = (workDays) => {
    if (!workDays) return null;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIdx = new Date().getDay();
    const adjustedIdx = todayIdx === 0 ? 6 : todayIdx - 1;
    return workDays[days[adjustedIdx]];
  };

  return (
    <main className="page">
      <div className="container">
        <Title>Our Friends</Title>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, fontSize: 32 }}>🔄</div>
        ) : (
          <ul className={styles.list}>
            {friends.map((f) => {
              const todayHours = getToday(f.workDays?.[0]);
              return (
                <li key={f._id} className={styles.item}>
                  <div className={styles.top}>
                    {f.imageUrl
                      ? <img src={f.imageUrl} alt={f.title} className={styles.logo} />
                      : <div className={styles.logoDefault}>🤝</div>
                    }
                    <h3 className={styles.name}>{f.title}</h3>
                  </div>
                  <div className={styles.contacts}>
                    {f.address && (
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(f.address)}`} target="_blank" rel="noopener noreferrer" className={styles.contact}>
                        📍 {f.address}
                      </a>
                    )}
                    {f.email && (
                      <a href={`mailto:${f.email}`} className={styles.contact}>✉️ {f.email}</a>
                    )}
                    {f.phone && (
                      <a href={`tel:${f.phone}`} className={styles.contact}>📞 {f.phone}</a>
                    )}
                  </div>
                  {todayHours && (
                    <div className={styles.hours}>
                      🕐 Bugün: {todayHours.isOpen ? `${todayHours.from} - ${todayHours.to}` : 'Kapalı'}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
