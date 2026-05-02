import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { register as registerUser } from '../../redux/slices/authSlice';
import PetBlock from '../../components/common/PetBlock';

const schema = yup.object({
  name: yup.string().required('Ad zorunludur'),
  email: yup.string().matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Geçersiz email').required('Email zorunludur'),
  password: yup.string().min(7, 'En az 7 karakter').required('Şifre zorunludur'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Şifreler eşleşmiyor').required('Şifre tekrarı zorunludur'),
});

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ name, email, password }) => {
    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Kayıt başarılı! Hoş geldiniz 🐾');
      navigate('/profile');
    } else {
      toast.error(result.payload || 'Kayıt başarısız');
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-form-side">
        <div className="auth-box">
          <h1>Register</h1>
          <p>Thank you for your interest in our platform.</p>
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label className="form-label">Ad</label>
              <input {...register('name')} className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Adınız" />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input {...register('email')} type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="email@example.com" />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Şifre</label>
              <input {...register('password')} type="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="En az 7 karakter" />
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Şifre Tekrar</label>
              <input {...register('confirmPassword')} type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Şifreyi tekrar girin" />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '14px' }}>
              {isSubmitting ? '...' : 'Registration'}
            </button>
          </form>
          <p className="auth-link">Already have an account? <Link to="/login">Log In</Link></p>
        </div>
      </div>
      <div className="auth-img-side">
        <PetBlock />
      </div>
    </div>
  );
}
