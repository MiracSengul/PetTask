import { useState, useEffect } from 'react';
import Title from '../../components/common/Title';
import SearchField from '../../components/common/SearchField';
import Pagination from '../../components/common/Pagination';
import api from '../../api/api';
import styles from './NewsPage.module.css';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const params = { page, limit: perPage };
        if (keyword) params.keyword = keyword;
        const res = await api.get('/news', { params });
        setNews(res.data.results || res.data.news || []);
        const total = res.data.totalPages || Math.ceil((res.data.total || 0) / perPage);
        setTotalPages(total || 1);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchNews();
  }, [keyword, page]);

  const handleSearch = (val) => {
    setKeyword(val);
    setPage(1);
  };

  return (
    <main className="page">
      <div className="container">
        <div className={styles.topBar}>
          <Title>News</Title>
          <SearchField onSearch={handleSearch} placeholder="Haber ara..." />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, fontSize: 32 }}>🔄</div>
        ) : news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: 48 }}>📰</div>
            <p>Haber bulunamadı.</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {news.map((item) => (
              <li key={item._id} className={styles.item}>
                {item.imgUrl && <img src={item.imgUrl} alt={item.title} className={styles.img} />}
                <div className={styles.body}>
                  <span className={styles.date}>{item.date ? new Date(item.date).toLocaleDateString('tr-TR') : ''}</span>
                  <h2 className={styles.itemTitle}>{item.title}</h2>
                  <p className={styles.text}>{item.text?.slice(0, 150)}...</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
                    Read more →
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </main>
  );
}
