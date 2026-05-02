import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Title from '../../components/common/Title';
import SearchField from '../../components/common/SearchField';
import Pagination from '../../components/common/Pagination';
import ModalAttention from '../../components/Modals/ModalAttention';
import ModalNotice from '../../components/Modals/ModalNotice';
import api from '../../api/api';
import styles from './NoticesPage.module.css';

export default function NoticesPage() {
  const { isLoggedIn } = useSelector((s) => s.auth);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [sex, setSex] = useState('');
  const [species, setSpecies] = useState('');
  const [sort, setSort] = useState('');
  const [categories, setCategories] = useState([]);
  const [sexList, setSexList] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [showAttention, setShowAttention] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    api.get('/notices/filters').then((r) => {
      setCategories(r.data.category || []);
      setSexList(r.data.sex || []);
      setSpeciesList(r.data.species || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 6 };
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        if (sex) params.sex = sex;
        if (species) params.species = species;
        if (sort) params.sortBy = sort;
        const res = await api.get('/notices', { params });
        setNotices(res.data.results || res.data.notices || []);
        const total = res.data.totalPages || Math.ceil((res.data.total || 0) / 6);
        setTotalPages(total || 1);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, [keyword, page, category, sex, species, sort]);

  const handleReset = () => {
    setKeyword(''); setCategory(''); setSex(''); setSpecies(''); setSort(''); setPage(1);
  };

  const handleLearnMore = async (notice) => {
    if (!isLoggedIn) { setShowAttention(true); return; }
    try {
      const res = await api.get(`/notices/${notice._id}`);
      setSelectedNotice(res.data);
    } catch { setSelectedNotice(notice); }
  };

  const handleFav = async (notice) => {
    if (!isLoggedIn) { setShowAttention(true); return; }
    try {
      if (notice.isFavorite) {
        await api.delete(`/notices/favorites/${notice._id}`);
      } else {
        await api.post(`/notices/favorites/${notice._id}`);
      }
      setNotices((prev) => prev.map((n) => n._id === notice._id ? { ...n, isFavorite: !n.isFavorite } : n));
    } catch (e) { console.error(e); }
  };

  return (
    <main className="page">
      <div className="container">
        <Title>Notices</Title>

        <div className={styles.filters}>
          <SearchField onSearch={(v) => { setKeyword(v); setPage(1); }} placeholder="İlan ara..." />
          <div className={styles.selects}>
            <select className="form-input" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
              <option value="">Kategori</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="form-input" value={sex} onChange={(e) => { setSex(e.target.value); setPage(1); }}>
              <option value="">Cinsiyet</option>
              {sexList.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="form-input" value={species} onChange={(e) => { setSpecies(e.target.value); setPage(1); }}>
              <option value="">Tür</option>
              {speciesList.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className={styles.sortRow}>
            <label><input type="radio" name="sort" value="" checked={sort === ''} onChange={() => setSort('')} /> Varsayılan</label>
            <label><input type="radio" name="sort" value="popularity" checked={sort === 'popularity'} onChange={() => setSort('popularity')} /> Popülerlik</label>
            <label><input type="radio" name="sort" value="price" checked={sort === 'price'} onChange={() => setSort('price')} /> Fiyat</label>
            <button className="btn btn-ghost" onClick={handleReset} style={{ fontSize: 12, padding: '8px 16px' }}>Reset</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, fontSize: 32 }}>🔄</div>
        ) : notices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: 48 }}>🐾</div>
            <p>İlan bulunamadı.</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {notices.map((n) => (
              <li key={n._id} className={styles.item}>
                <div className={styles.imgWrap}>
                  {n.imgURL && <img src={n.imgURL} alt={n.title} className={styles.img} />}
                  <button
                    className={`${styles.favBtn} ${n.isFavorite ? styles.favActive : ''}`}
                    onClick={() => handleFav(n)}
                    title="Favorilere ekle"
                  >❤️</button>
                  <span className={styles.category}>{n.category}</span>
                </div>
                <div className={styles.body}>
                  <h3 className={styles.itemTitle}>{n.title}</h3>
                  <div className={styles.meta}>
                    <span>🐾 {n.name}</span>
                    <span>📅 {n.birthday}</span>
                    <span>{n.sex === 'male' ? '♂' : '♀'} {n.sex}</span>
                    <span>🏷 {n.species}</span>
                  </div>
                  {n.comment && <p className={styles.comment}>{n.comment?.slice(0, 80)}...</p>}
                  <button className="btn btn-primary" onClick={() => handleLearnMore(n)} style={{ marginTop: 'auto', width: '100%', fontSize: 13 }}>
                    Learn more
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showAttention && <ModalAttention onClose={() => setShowAttention(false)} />}
      {selectedNotice && (
        <ModalNotice
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
          onFavoriteToggle={(id, isFav) => {
            setNotices((prev) => prev.map((n) => n._id === id ? { ...n, isFavorite: isFav } : n));
          }}
        />
      )}
    </main>
  );
}
