import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import api from '../../api/api';
import PetBlock from '../../components/common/PetBlock';
import styles from './AddPetPage.module.css';

const schema = yup.object({
  title: yup.string().required('Başlık zorunludur'),
  name: yup.string().required('Ad zorunludur'),
  imgURL: yup.string().matches(/^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)$/, 'Geçersiz resim URL').required('Resim URL zorunludur'),
  species: yup.string().required('Tür zorunludur'),
  birthday: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Format: YYYY-MM-DD').required('Doğum tarihi zorunludur'),
  sex: yup.string().required('Cinsiyet zorunludur'),
});

export default function AddPetPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await api.post('/users/current/pets', data);
      toast.success('Evcil hayvan eklendi! 🐾');
      navigate('/profile');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Hata oluştu');
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-form-side">
        <div className="auth-box" style={{ maxWidth: 520 }}>
          <h1>Add Pet</h1>
          <p>Add your furry friend to your profile.</p>
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.sexRow}>
              <label className={styles.sexLabel}>
                <input {...register('sex')} type="radio" value="male" /> ♂ Male
              </label>
              <label className={styles.sexLabel}>
                <input {...register('sex')} type="radio" value="female" /> ♀ Female
              </label>
            </div>
            {errors.sex && <span className="form-error">{errors.sex.message}</span>}

            <div className="form-group">
              <label className="form-label">Başlık *</label>
              <input {...register('title')} className={`form-input ${errors.title ? 'error' : ''}`} placeholder="Başlık" />
              {errors.title && <span className="form-error">{errors.title.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Ad *</label>
              <input {...register('name')} className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Evcil hayvanın adı" />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Doğum Tarihi *</label>
              <input {...register('birthday')} className={`form-input ${errors.birthday ? 'error' : ''}`} placeholder="YYYY-MM-DD" />
              {errors.birthday && <span className="form-error">{errors.birthday.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Tür *</label>
              <input {...register('species')} className={`form-input ${errors.species ? 'error' : ''}`} placeholder="köpek, kedi..." />
              {errors.species && <span className="form-error">{errors.species.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Resim URL *</label>
              <input {...register('imgURL')} className={`form-input ${errors.imgURL ? 'error' : ''}`} placeholder="https://..." />
              {errors.imgURL && <span className="form-error">{errors.imgURL.message}</span>}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/profile')} style={{ flex: 1 }}>
                ← Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ flex: 1 }}>
                {isSubmitting ? '...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="auth-img-side">
        <PetBlock />
      </div>
    </div>
  );
}
