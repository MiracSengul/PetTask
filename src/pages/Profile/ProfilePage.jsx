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
  const [loading, setLoading] = useState(false);

  const [fullUser, setFullUser] = useState(null);
  const [activeTab, setActiveTab] = useState('favorites');

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

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(clientLogout());
    navigate('/');
  };

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

  const handleUserUpdated = (updatedUser) => {
    setFullUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const pets = fullUser?.pets || [];
  const favorites = fullUser?.noticesFavorites || [];
  const viewed = fullUser?.noticesViewed || [];
  const notices = activeTab === 'favorites' ? favorites : viewed;

  return (
    <main className="page">
      <div className="container">
        <div className={styles.layout}>

          {/* ─── Sol Panel: UserCard ─── */}
          <aside className={styles.userCard}>
            {/* Üst satır: User rozeti + edit ikonu */}
            <div className={styles.cardTopRow}>
              <span className={styles.userBadge}>
                <span className={styles.userBadgeIcon}>👤</span> User
              </span>
              <button
                className={styles.editIconBtn}
                onClick={() => setShowEdit(true)}
                title="Düzenle"
              >
                ✏️
              </button>
            </div>

            {/* Avatar */}
            <div className={styles.avatarWrap}>
              {fullUser?.avatar ? (
                <img src={fullUser.avatar} alt="avatar" className={styles.avatar} />
              ) : (
                <div className={styles.avatarDefault}>
                  <span className={styles.avatarIcon}>👤</span>
                </div>
              )}
              <p className={styles.uploadLabel}>Upload photo</p>
            </div>

            {/* My Information – input alanları */}
            <div className={styles.infoSection}>
              <p className={styles.infoSectionTitle}>My information</p>
              <div className={styles.inputGroup}>
                <input
                  className={styles.infoInput}
                  type="text"
                  value={fullUser?.name || user?.name || ''}
                  readOnly
                  placeholder="Name"
                />
                <input
                  className={styles.infoInput}
                  type="email"
                  value={fullUser?.email || ''}
                  readOnly
                  placeholder="Email"
                />
                <input
                  className={styles.infoInput}
                  type="tel"
                  value={fullUser?.phone || ''}
                  readOnly
                  placeholder="Phone"
                />
              </div>
            </div>

            {/* My Pets */}
            <div className={styles.petsBlock}>
              <div className={styles.petsHeader}>
                <h3 className={styles.petsTitle}>My pets</h3>
                <button
                  className={styles.addPetBtn}
                  onClick={() => navigate('/add-pet')}
                >
                  Add pet +
                </button>
              </div>

              {pets.length === 0 ? (
                <p className={styles.emptyText}>Henüz evcil hayvan eklenmedi.</p>
              ) : (
                <ul className={styles.petsList}>
                  {pets.map((p) => (
                    <li key={p._id} className={styles.petItem}>
                      {/* Resim */}
                      {p.imgURL ? (
                        <img src={p.imgURL} alt={p.name} className={styles.petImg} />
                      ) : (
                        <div className={styles.petImgDefault}>🐾</div>
                      )}

                      {/* İçerik */}
                      <div className={styles.petContent}>
                        {/* Pet'in başlığı/türü – API'nize göre p.title veya p.breed kullanabilirsiniz */}
                        <p className={styles.petTitle}>{p.title || p.breed || p.species}</p>
                        <div className={styles.petDetails}>
                          <div className={styles.petDetailCol}>
                            <span className={styles.petDetailLabel}>Name</span>
                            <span className={styles.petDetailValue}>{p.name}</span>
                          </div>
                          <div className={styles.petDetailCol}>
                            <span className={styles.petDetailLabel}>Birthday</span>
                            <span className={styles.petDetailValue}>
                              {p.birthday
                                ? new Date(p.birthday).toLocaleDateString('tr-TR')
                                : '—'}
                            </span>
                          </div>
                          <div className={styles.petDetailCol}>
                            <span className={styles.petDetailLabel}>Sex</span>
                            <span className={styles.petDetailValue}>{p.sex || '—'}</span>
                          </div>
                          <div className={styles.petDetailCol}>
                            <span className={styles.petDetailLabel}>Species</span>
                            <span className={styles.petDetailValue}>{p.species || '—'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sil butonu */}
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

            {/* Log Out */}
            <button
              className={styles.logoutBtn}
              onClick={() => setShowLogout(true)}
            >
              LOG OUT
            </button>
          </aside>

          {/* ─── Sağ Panel: MyNotices ─── */}
          <section className={styles.notices}>
            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'favorites' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                My favorite pets
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'viewed' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('viewed')}
              >
                Viewed
              </button>
            </div>

            {/* İçerik */}
            {loading ? (
              <div className={styles.emptyState}>🔄</div>
            ) : notices.length === 0 ? (
              <div className={styles.emptyState}>
                <div style={{ fontSize: 36 }}>🐾</div>
                <p>İlan bulunamadı.</p>
              </div>
            ) : (
              <ul className={styles.noticesGrid}>
                {notices.map((n) => (
                  <li key={n._id} className={styles.noticeCard}>
                    {/* Kart resmi */}
                    {n.imgURL && (
                      <div className={styles.noticeImgWrap}>
                        <img src={n.imgURL} alt={n.title} className={styles.noticeImg} />
                      </div>
                    )}

                    {/* Kart gövdesi */}
                    <div className={styles.noticeCardBody}>
                      {/* Başlık + yıldız */}
                      <div className={styles.noticeTitleRow}>
                        <h4 className={styles.noticeTitle}>{n.title}</h4>
                        <span className={styles.noticeStar}>
                          ⭐ {n.popularity ?? n.rating ?? ''}
                        </span>
                      </div>

                      {/* Detay satırı */}
                      <div className={styles.noticeDetails}>
                        {[
                          { label: 'Name', value: n.name },
                          { label: 'Birthday', value: n.birthday ? new Date(n.birthday).toLocaleDateString('tr-TR') : '—' },
                          { label: 'Sex', value: n.sex || '—' },
                          { label: 'Species', value: n.species || '—' },
                          { label: 'Category', value: n.category || '—' },
                        ].map(({ label, value }) => (
                          <div key={label} className={styles.noticeDetailCol}>
                            <span className={styles.noticeDetailLabel}>{label}</span>
                            <span className={styles.noticeDetailValue}>{value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Açıklama */}
                      {n.comment && (
                        <p className={styles.noticeComment}>{n.comment}</p>
                      )}

                      {/* Fiyat */}
                      {n.price != null && (
                        <p className={styles.noticePrice}>${n.price.toFixed(2)}</p>
                      )}

                      {/* Aksiyon satırı */}
                      <div className={styles.noticeActions}>
                        <button
                          className={styles.learnMoreBtn}
                          onClick={() => navigate(`/notices/${n._id}`)}
                        >
                          Learn more
                        </button>
                        {activeTab === 'favorites' && (
                          <button
                            onClick={() => handleRemoveFavorite(n._id)}
                            className={styles.deleteBtn}
                            title="Favorilerden çıkar"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
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
