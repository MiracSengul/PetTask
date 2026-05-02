import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ModalAttention({ onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380, textAlign: 'center' }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Giriş Yapın</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28, fontSize: 14 }}>
          Bu özelliği kullanmak için lütfen giriş yapın veya hesap oluşturun.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/login" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>Log In</Link>
          <Link to="/register" className="btn btn-primary" onClick={onClose} style={{ flex: 1 }}>Register</Link>
        </div>
      </div>
    </div>
  );
}
