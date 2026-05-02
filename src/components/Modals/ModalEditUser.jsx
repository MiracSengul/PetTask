import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUser } from '../../redux/slices/authSlice';

const schema = yup.object({
  name: yup.string(),
  email: yup.string().matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Geçersiz email'),
  avatar: yup.string().matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))?$/, 'Geçersiz URL').nullable(),
  phone: yup.string().matches(/^(\+38\d{10})?$/, 'Format: +38XXXXXXXXXX').nullable(),
});

export default function ModalEditUser({ onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const onSubmit = async (data) => {
    const result = await dispatch(updateUser(data));
    if (updateUser.fulfilled.match(result)) {
      toast.success('Profil güncellendi!');
      onClose();
    } else {
      toast.error(result.payload || 'Güncelleme başarısız');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Profili Düzenle</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Ad</label>
            <input {...register('name')} className={`form-input ${errors.name ? 'error' : ''}`} />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input {...register('email')} className={`form-input ${errors.email ? 'error' : ''}`} />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Avatar URL</label>
            <input {...register('avatar')} placeholder="https://..." className={`form-input ${errors.avatar ? 'error' : ''}`} />
            {errors.avatar && <span className="form-error">{errors.avatar.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Telefon</label>
            <input {...register('phone')} placeholder="+38XXXXXXXXXX" className={`form-input ${errors.phone ? 'error' : ''}`} />
            {errors.phone && <span className="form-error">{errors.phone.message}</span>}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>İptal</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? '...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
