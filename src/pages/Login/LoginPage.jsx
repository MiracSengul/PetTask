import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { login } from '../../redux/slices/authSlice';
import styles from './LoginPage.module.css';

const schema = yup.object({
  email: yup
    .string()
    .matches(
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      'Geçersiz email'
    )
    .required('Email zorunludur'),

  password: yup
    .string()
    .min(7, 'En az 7 karakter')
    .required('Şifre zorunludur'),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
    <div className={styles.layout}>
      <div className={styles.card}>
        {/* SOL PANEL */}
        <div className={styles.left}>
          <img src="/LoginDog.png" alt="Dog" className={styles.dog} />

          <div className={styles.petCard}>
            <div className={styles.avatar}>
              <img src="/dog.svg" alt="Dog Avatar" />
            </div>

            <div className={styles.petInfo}>
              <div className={styles.petHeader}>
                <span className={styles.name}>Rich</span>
                <span className={styles.birthday}>
                  Birthday: 21.09.2020
                </span>
              </div>

              <p className={styles.desc}>
                Rich would be the perfect addition to an active family that
                loves to play and go on walks.
              </p>
            </div>
          </div>
        </div>

        {/* SAĞ PANEL */}
        <div className={styles.right}>
          <div className={styles.formBox}>
            <h1>Log in</h1>
            <p>
              Welcome! Please enter your credentials to login to the platform:
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              {/* EMAIL */}
              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="anna00@gmail.com"
                    className={`${styles.input} ${
                      errors.email ? styles.error : ''
                    }`}
                  />

                  {errors.email && (
                    <span className={styles.errorIcon}>✕</span>
                  )}
                </div>

                {errors.email && (
                  <span className={styles.errorText}>
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* PASSWORD */}
              <div className={styles.inputGroup}>
                <div className={styles.passwordWrapper}>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className={`${styles.input} ${
                      errors.password ? styles.error : ''
                    }`}
                  />

                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img
                      src={showPassword ? '/eye-off.svg' : '/eye.svg'}
                      alt="toggle password"
                    />
                  </button>
                </div>

                {errors.password && (
                  <span className={styles.errorText}>
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.loginBtn}
              >
                {isSubmitting ? '...' : 'LOG IN'}
              </button>
            </form>

            <p className={styles.register}>
              Don’t have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}