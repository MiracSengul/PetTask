import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { login } from '../../redux/slices/authSlice';
import PetBlock from '../../components/common/PetBlock';

const schema = yup.object({
  email: yup.string().matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Geçersiz email').required('Email zorunludur'),
  password: yup.string().min(7, 'En az 7 karakter').required('Şifre zorunludur'),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      toast.success('Hoş geldiniz! 🐾');
      navigate('/profile');
    } else {
      toast.error(result.payload || 'Giriş başarısız');
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-form-side">
        <div className="auth-box">
          <h1>Log In</h1>
          <p>Welcome back! Please enter your credentials.</p>
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
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
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '14px' }}>
              {isSubmitting ? '...' : 'Log In'}
            </button>
          </form>
          <p className="auth-link">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
      <div className="auth-img-side">
        <PetBlock />
      </div>
    </div>
  );
}
