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
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleFav = async () => {
    setLoading(true);
    try {
      if (isFav) {
        await api.delete(`/notices/favorites/${notice._id}`);
      } else {
        await api.post(`/notices/favorites/${notice._id}`);
      }
      setIsFav(!isFav);
      onFavoriteToggle && onFavoriteToggle(notice._id, !isFav);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Hata oluştu');
    }
    setLoading(false);
  };

  if (!notice) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${styles.modal}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        {notice.imgURL && <img src={notice.imgURL} alt={notice.title} className={styles.img} />}
        <div className={styles.body}>
          <h2 className={styles.title}>{notice.title}</h2>
          <div className={styles.info}>
            <div className={styles.row}><span>Ad:</span><span>{notice.name}</span></div>
            <div className={styles.row}><span>Doğum Tarihi:</span><span>{notice.birthday}</span></div>
            <div className={styles.row}><span>Cinsiyet:</span><span>{notice.sex}</span></div>
            <div className={styles.row}><span>Tür:</span><span>{notice.species}</span></div>
            <div className={styles.row}><span>Kategori:</span><span>{notice.category}</span></div>
            <div className={styles.row}><span>Popülerlik:</span><span>❤️ {notice.popularity || 0}</span></div>
          </div>
          {notice.comment && <p className={styles.comment}>{notice.comment}</p>}
          {isLoggedIn && (
            <div className={styles.actions}>
              <button className={`btn ${isFav ? 'btn-danger' : 'btn-outline'}`} onClick={handleFav} disabled={loading}>
                {isFav ? '💔 Remove from favorites' : '❤️ Add to favorites'}
              </button>
              {notice.owner?.phone && (
                <a href={`tel:${notice.owner.phone}`} className="btn btn-primary">Contact</a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
