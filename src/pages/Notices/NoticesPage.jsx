import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SearchField from '../../components/common/SearchField';
import Pagination from '../../components/common/Pagination';
import ModalAttention from '../../components/Modals/ModalAttention';
import ModalNotice from '../../components/Modals/ModalNotice';
import api from '../../api/api';
import styles from './NoticesPage.module.css';

const SORT_OPTIONS = [
  { label: 'By date',       param: 'byDate',       value: true },
  { label: 'By popularity', param: 'byPopularity', value: true },
  { label: 'By price',      param: 'byPrice',      value: true },
];

export default function NoticesPage() {
  const { isLoggedIn } = useSelector((s) => s.auth);

  const [notices, setNotices]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [keyword,  setKeyword]  = useState('');
  const [category, setCategory] = useState('');
  const [sex,      setSex]      = useState('');
  const [species,  setSpecies]  = useState('');
  const [activeSort, setActiveSort] = useState(0);

  const [categories,      setCategories]      = useState([]);
  const [sexOptions,      setSexOptions]      = useState([]);
  const [speciesOptions,  setSpeciesOptions]  = useState([]);

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [showAttention,  setShowAttention]  = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Filtre seçeneklerini al
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, sexRes, specRes] = await Promise.all([
          api.get('/notices/categories'),
          api.get('/notices/sex'),
          api.get('/notices/species'),
        ]);
        setCategories(catRes.data);
        setSexOptions(sexRes.data);
        setSpeciesOptions(specRes.data);
      } catch { /* */ }
    };
    fetchOptions();
  }, []);

  // Kullanıcı favori ID'lerini al
  useEffect(() => {
    if (!isLoggedIn) {
      setFavoriteIds([]);
      return;
    }
    const fetchFavorites = async () => {
      try {
        const { data } = await api.get('/users/current');
        const ids = data.noticesFavorites?.map((item) => item._id) || [];
        setFavoriteIds(ids);
      } catch { /* */ }
    };
    fetchFavorites();
  }, [isLoggedIn]);

  // İlanları çek
  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 6 };
      if (keyword)  params.keyword  = keyword;
      if (category) params.category = category;
      if (sex)      params.sex      = sex;
      if (species)  params.species  = species;
      const active = SORT_OPTIONS[activeSort];
      if (active) params[active.param] = active.value;

      const { data } = await api.get('/notices', { params });
      const results = (data.results || []).map((notice) => ({
        ...notice,
        isFavorite: favoriteIds.includes(notice._id),
      }));
      setNotices(results);
      setTotalPages(data.totalPages || 1);
    } catch { toast.error('İlanlar yüklenemedi'); }
    setLoading(false);
  }, [page, keyword, category, sex, species, activeSort, favoriteIds]);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  // Yardımcı fonksiyonlar
  const handleSearch = (val) => { setKeyword(val); setPage(1); };
  const handleReset = () => {
    setKeyword(''); setCategory(''); setSex(''); setSpecies('');
    setActiveSort(0); setPage(1);
  };

  const handleLearnMore = async (notice) => {
    if (!isLoggedIn) { setShowAttention(true); return; }
    try {
      const { data } = await api.get(`/notices/${notice._id}`);
      setSelectedNotice({
        ...data,
        isFavorite: favoriteIds.includes(data._id), // ★ isFavorite ekleniyor
      });
    } catch { toast.error('İlan detayı alınamadı'); }
  };

  const handleFav = async (notice, e) => {
    e.stopPropagation();
    if (!isLoggedIn) { setShowAttention(true); return; }
    const noticeId = notice._id;
    const isFav = favoriteIds.includes(noticeId);
    try {
      let res;
      if (isFav) {
        res = await api.delete(`/notices/favorites/remove/${noticeId}`);
      } else {
        res = await api.post(`/notices/favorites/add/${noticeId}`);
      }
      const updatedIds = res.data;
      setFavoriteIds(updatedIds);
      setNotices((prev) =>
        prev.map((n) => n._id === noticeId ? { ...n, isFavorite: !isFav } : n)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Favori işlemi başarısız');
    }
  };

  const handleFavoriteToggle = (id, newState) => {
    setNotices((prev) => prev.map((n) => n._id === id ? { ...n, isFavorite: newState } : n));
  };

  return (
    <main className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Find your favorite pet</h1>
        <div className={styles.filterBar}>
          <SearchField onSearch={handleSearch} placeholder="Search" />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">Category</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sex} onChange={(e) => { setSex(e.target.value); setPage(1); }}>
            <option value="">By gender</option>
            {sexOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={species} onChange={(e) => { setSpecies(e.target.value); setPage(1); }}>
            <option value="">By type</option>
            {speciesOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className={styles.sortBar}>
          {SORT_OPTIONS.map((opt, i) => (
            <label key={opt.label} className={styles.radioLabel}>
              <input type="radio" name="sort" checked={activeSort === i} onChange={() => { setActiveSort(i); setPage(1); }} />
              {opt.label}
            </label>
          ))}
          <button className={styles.resetBtn} onClick={handleReset}>Reset</button>
        </div>
        {loading ? (
          <div className={styles.empty}><div className="spinner" /></div>
        ) : notices.length === 0 ? (
          <div className={styles.empty}><div style={{ fontSize: 48 }}>🐾</div><p>No notices found.</p></div>
        ) : (
          <ul className={styles.list}>
            {notices.map((n) => (
              <li key={n._id} className={styles.card}>
                <div className={styles.imgWrap}>
                  {n.imgURL ? <img src={n.imgURL} alt={n.title} className={styles.img} /> : <div className={styles.imgPlaceholder}>🐾</div>}
                  <button
                    className={`${styles.favBtn} ${n.isFavorite ? styles.favActive : ''}`}
                    onClick={(e) => handleFav(n, e)}
                  >
                    <img src="/heart.svg" alt="favorite" className={styles.heartIcon} />
                  </button>
                  {n.category && <span className={styles.categoryBadge}>{n.category}</span>}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.ratingRow}><span className={styles.rating}>⭐ {n.popularity || 0}</span></div>
                  <h3 className={styles.cardTitle}>{n.title}</h3>
                  <div className={styles.tags}>
                    {n.birthday && <span>📅 {n.birthday}</span>}
                    {n.sex && <span>{n.sex === 'male' ? '♂' : n.sex === 'female' ? '♀' : '?'} {n.sex}</span>}
                    {n.species && <span>🐾 {n.species}</span>}
                    {n.category && <span>🏷 {n.category}</span>}
                  </div>
                  {n.comment && <p className={styles.comment}>{n.comment?.slice(0, 90)}...</p>}
                  {n.price && <p className={styles.price}>${n.price}</p>}
                  <button className={styles.learnBtn} onClick={() => handleLearnMore(n)}>Learn more</button>
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
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
    </main>
  );
}