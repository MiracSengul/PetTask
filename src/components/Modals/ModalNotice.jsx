import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../../api/api';
import styles from './ModalNotice.module.css';

export default function ModalNotice({ notice, onClose, onFavoriteToggle }) {
  const { isLoggedIn } = useSelector((s) => s.auth);
  const [isFav, setIsFav] = useState(notice?.isFavorite || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!notice) return null;

  const handleFav = async () => {
    setLoading(true);
    const previousFav = isFav;
    try {
      if (isFav) {
        await api.delete(`/notices/favorites/remove/${notice._id}`);
        toast.success('Favorilerden çıkarıldı');
      } else {
        await api.post(`/notices/favorites/add/${notice._id}`);
        toast.success('Favorilere eklendi ❤️');
      }
      const newVal = !isFav;
      setIsFav(newVal);
      onFavoriteToggle?.(notice._id, newVal);
    } catch (err) {
      setIsFav(previousFav); // hata olursa eski duruma dön
      toast.error(err.response?.data?.message || 'İşlem başarısız');
    }
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {notice.imgURL && (
          <div className={styles.imgWrap}>
            <img src={notice.imgURL} alt={notice.title} className={styles.img} />
          </div>
        )}

        <div className={styles.body}>
          <div className={styles.ratingRow}>
            <span className={styles.rating}>⭐ {notice.popularity || 0}</span>
          </div>
          <h2 className={styles.title}>{notice.title}</h2>
          <div className={styles.infoGrid}>
            {[
              ['Name',     notice.name],
              ['Birthday', notice.birthday],
              ['Sex',      notice.sex],
              ['Species',  notice.species],
              ['Category', notice.category],
              ['Price',    notice.price ? `$${notice.price}` : null],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className={styles.infoRow}>
                <span className={styles.infoLabel}>{label}</span>
                <span className={styles.infoValue}>{value}</span>
              </div>
            ))}
          </div>
          {notice.comment && <p className={styles.comment}>{notice.comment}</p>}

          {isLoggedIn && (
            <div className={styles.actions}>
              <button
                className={`${styles.actionBtn} ${isFav ? styles.actionBtnActive : ''}`}
                onClick={handleFav}
                disabled={loading}
              >
                {isFav ? '❤️ Remove from' : '🤍 Add to'}
              </button>
              {notice.user?.phone && (
                <a href={`tel:${notice.user.phone}`} className={styles.contactBtn}>
                  Contact
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}