import { useEffect } from 'react';

export default function ModalApproveAction({ onClose, onConfirm, question }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 360, textAlign: 'center' }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Emin misiniz?</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 28, fontSize: 14 }}>{question}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm} style={{ flex: 1 }}>Yes</button>
        </div>
      </div>
    </div>
  );
}
