import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clientLogout, logout } from '../../redux/slices/authSlice';
import ModalEditUser from '../../components/Modals/ModalEditUser';
import ModalApproveAction from '../../components/Modals/ModalApproveAction';
import api from '../../api/api';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [pets, setPets] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [viewed, setViewed] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/users/current/pets').then((r) => setPets(r.data.results || r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const endpoint = activeTab === 'favorites' ? '/notices/favorites' : '/notices/viewed';
    api.get(endpoint).then((r) => {
      const list = r.data.results || r.data.notices || [];
      if (activeTab === 'favorites') setFavorites(list);
      else setViewed(list);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [activeTab]);

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(clientLogout());
    navigate('/home');
  };

  const handleDeletePet = async (id) => {
    try {
      await api.delete(`/users/current/pets/${id}`);
      setPets((prev) => prev.filter((p) => p._id !== id));
      toast.success('Evcil hayvan silindi');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Hata');
    }
  };

  const handleRemoveFavorite = async (id) => {
    try {
      await api.delete(`/notices/favorites/${id}`);
      setFavorites((prev) => prev.filter((n) => n._id !== id));
    } catch (e) {
      toast.error('Hata oluştu');
    }
  };

  const notices = activeTab === 'favorites' ? favorites : viewed;

  return (
    <main className="page">
      <div className="container">
        <div className={styles.layout}>
          {/* UserCard */}
          <aside className={styles.userCard}>
            <div className={styles.avatarWrap}>
              {user?.avatar
                ? <img src={user.avatar} alt="avatar" className={styles.avatar} />
                : <div className={styles.avatarDefault}>👤</div>
              }
            </div>
            <button className="btn btn-ghost" onClick={() => setShowEdit(true)} style={{ width: '100%' }}>✏️ Edit</button>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.name}</p>
              {user?.email && <p className={styles.userDetail}>✉️ {user.email}</p>}
              {user?.phone && <p className={styles.userDetail}>📞 {user.phone}</p>}
            </div>

            {/* Pets */}
            <div className={styles.petsBlock}>
              <div className={styles.petsHeader}>
                <h3>My Pets</h3>
                <button className="btn btn-primary" onClick={() => navigate('/add-pet')} style={{ fontSize: 12, padding: '6px 14px' }}>
                  + Add pet
                </button>
              </div>
              {pets.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Henüz evcil hayvan eklenmedi.</p>
              ) : (
                <ul className={styles.petsList}>
                  {pets.map((p) => (
                    <li key={p._id} className={styles.petItem}>
                      {p.imgURL
                        ? <img src={p.imgURL} alt={p.name} className={styles.petImg} />
                        : <div className={styles.petImgDefault}>🐾</div>
                      }
                      <div className={styles.petInfo}>
                        <strong>{p.name}</strong>
                        <span>{p.species}</span>
                      </div>
                      <button onClick={() => handleDeletePet(p._id)} className={styles.deleteBtn} title="Sil">🗑️</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="btn btn-ghost" onClick={() => setShowLogout(true)} style={{ width: '100%', color: 'var(--color-error)' }}>
              Log Out
            </button>
          </aside>

          {/* MyNotices */}
          <section className={styles.notices}>
            <h2 className={styles.noticesTitle}>My Notices</h2>
            <div className={styles.tabs}>
              <button className={`${styles.tab} ${activeTab === 'favorites' ? styles.activeTab : ''}`} onClick={() => setActiveTab('favorites')}>
                My favorites pets
              </button>
              <button className={`${styles.tab} ${activeTab === 'viewed' ? styles.activeTab : ''}`} onClick={() => setActiveTab('viewed')}>
                Viewed
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, fontSize: 32 }}>🔄</div>
            ) : notices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-secondary)' }}>
                <div style={{ fontSize: 36 }}>🐾</div>
                <p>İlan bulunamadı.</p>
              </div>
            ) : (
              <ul className={styles.noticesList}>
                {notices.map((n) => (
                  <li key={n._id} className={styles.noticeItem}>
                    {n.imgURL && <img src={n.imgURL} alt={n.title} className={styles.noticeImg} />}
                    <div className={styles.noticeBody}>
                      <h4>{n.title}</h4>
                      <p>{n.name} • {n.species}</p>
                    </div>
                    {activeTab === 'favorites' && (
                      <button onClick={() => handleRemoveFavorite(n._id)} className={styles.deleteBtn} title="Favorilerden çıkar">🗑️</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {showEdit && <ModalEditUser onClose={() => setShowEdit(false)} />}
      {showLogout && (
        <ModalApproveAction
          onClose={() => setShowLogout(false)}
          onConfirm={handleLogout}
          question="Hesabınızdan çıkış yapmak istediğinizden emin misiniz?"
        />
      )}
    </main>
  );
}
