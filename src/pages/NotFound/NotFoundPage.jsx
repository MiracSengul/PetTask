import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🐾</div>
        <h1 style={{ fontSize: 72, fontWeight: 800, color: 'var(--color-brand)' }}>404</h1>
        <p style={{ fontSize: 18, color: 'var(--color-text-secondary)', marginBottom: 32 }}>
          Sayfa bulunamadı
        </p>
        <Link to="/home" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
          ← Ana Sayfa
        </Link>
      </div>
    </main>
  );
}
