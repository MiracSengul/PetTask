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

  const [showEdit, setShowEdit]   = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [loading, setLoading]     = useState(false);

  // Kullanıcı tam verisi (evcil hayvanlar, favoriler, görüntülenenler)
  const [fullUser, setFullUser]   = useState(null);
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' | 'viewed'

  // ── Kullanıcı tam verisini çek (pets + noticesFavorites + noticesViewed) ──
  useEffect(() => {
    const fetchFullUser = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/users/current/full');
        setFullUser(data);
      } catch {
        toast.error('Kullanıcı bilgileri alınamadı');
      }
      setLoading(false);
    };
    fetchFullUser();
  }, []);

  // ── Çıkış ──────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(clientLogout());
    navigate('/');
  };

  // ── Evcil hayvan silme ─────────────────────────────────────────────
  const handleDeletePet = async (id) => {
    try {
      await api.delete(`/users/current/pets/remove/${id}`);
      setFullUser((prev) => ({
        ...prev,
        pets: prev.pets.filter((p) => p._id !== id),
      }));
      toast.success('Evcil hayvan silindi');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Silme başarısız');
    }
  };

  // ── Favori kaldırma ───────────────────────────────────────────────
  const handleRemoveFavorite = async (id) => {
    try {
      await api.delete(`/notices/favorites/remove/${id}`);
      setFullUser((prev) => ({
        ...prev,
        noticesFavorites: prev.noticesFavorites.filter((n) => n._id !== id),
      }));
      toast.success('Favorilerden çıkarıldı');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Hata oluştu');
    }
  };

  // ── Kullanıcı düzenlendikten sonra güncelle (ModalEditUser'tan çağrılır) ──
  const handleUserUpdated = (updatedUser) => {
    setFullUser((prev) => ({ ...prev, ...updatedUser }));
  };

  // ── Render yardımcıları ───────────────────────────────────────────
  const pets      = fullUser?.pets || [];
  const favorites = fullUser?.noticesFavorites || [];
  const viewed    = fullUser?.noticesViewed || [];
  const notices   = activeTab === 'favorites' ? favorites : viewed;

  return (
    <main className="page">
      <div className="container">
        <div className={styles.layout}>
          {/* ─── Sol Panel: UserCard ─── */}
          <aside className={styles.userCard}>
            <div className={styles.avatarWrap}>
              {fullUser?.avatar ? (
                <img src={fullUser.avatar} alt="avatar" className={styles.avatar} />
              ) : (
                <div className={styles.avatarDefault}>👤</div>
              )}
            </div>
            <button
              className="btn btn-ghost"
              onClick={() => setShowEdit(true)}
              style={{ width: '100%' }}
            >
              ✏️ Edit
            </button>

            <div className={styles.userInfo}>
              <p className={styles.userName}>{fullUser?.name || user?.name}</p>
              {fullUser?.email && <p className={styles.userDetail}>✉️ {fullUser.email}</p>}
              {fullUser?.phone && <p className={styles.userDetail}>📞 {fullUser.phone}</p>}
            </div>

            {/* Pets */}
            <div className={styles.petsBlock}>
              <div className={styles.petsHeader}>
                <h3>My Pets</h3>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/add-pet')}
                  style={{ fontSize: 12, padding: '6px 14px' }}
                >
                  + Add pet
                </button>
              </div>
              {pets.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  Henüz evcil hayvan eklenmedi.
                </p>
              ) : (
                <ul className={styles.petsList}>
                  {pets.map((p) => (
                    <li key={p._id} className={styles.petItem}>
                      {p.imgURL ? (
                        <img src={p.imgURL} alt={p.name} className={styles.petImg} />
                      ) : (
                        <div className={styles.petImgDefault}>🐾</div>
                      )}
                      <div className={styles.petInfo}>
                        <strong>{p.name}</strong>
                        <span>{p.species}</span>
                      </div>
                      <button
                        onClick={() => handleDeletePet(p._id)}
                        className={styles.deleteBtn}
                        title="Sil"
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className="btn btn-ghost"
              onClick={() => setShowLogout(true)}
              style={{ width: '100%', color: 'var(--color-error)' }}
            >
              Log Out
            </button>
          </aside>

          {/* ─── Sağ Panel: MyNotices ─── */}
          <section className={styles.notices}>
            <h2 className={styles.noticesTitle}>My Notices</h2>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'favorites' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                My favorites pets
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'viewed' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('viewed')}
              >
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
                    {n.imgURL && (
                      <img src={n.imgURL} alt={n.title} className={styles.noticeImg} />
                    )}
                    <div className={styles.noticeBody}>
                      <h4>{n.title}</h4>
                      <p>
                        {n.name} • {n.species}
                      </p>
                    </div>
                    {activeTab === 'favorites' && (
                      <button
                        onClick={() => handleRemoveFavorite(n._id)}
                        className={styles.deleteBtn}
                        title="Favorilerden çıkar"
                      >
                        🗑️
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {/* Modallar */}
      {showEdit && (
        <ModalEditUser
          onClose={() => setShowEdit(false)}
          onUpdated={handleUserUpdated}
        />
      )}
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