export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;
    let last = null;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        if (last && i - last > 1) pages.push('...');
        pages.push(i);
        last = i;
      }
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        title="İlk sayfa"
      >«</button>
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Önceki sayfa"
      >‹</button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="page-btn" style={{ border: 'none', cursor: 'default' }}>…</span>
        ) : (
          <button
            key={p}
            className={`page-btn ${p === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
          >{p}</button>
        )
      )}

      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Sonraki sayfa"
      >›</button>
      <button
        className="page-btn"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="Son sayfa"
      >»</button>
    </div>
  );
}
