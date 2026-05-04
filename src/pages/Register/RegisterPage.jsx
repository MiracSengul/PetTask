import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { register as registerUser } from '../../redux/slices/authSlice';
import { useState } from 'react';
import styles from './RegisterPage.module.css';

const schema = yup.object({
  name: yup.string().required('Ad zorunludur'),
  email: yup
    .string()
    .matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Geçersiz email')
    .required('Email zorunludur'),
  password: yup
    .string()
    .min(7, 'En az 7 karakter')
    .required('Şifre zorunludur'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı zorunludur'),
});

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

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
    <div className={styles.layout}>
      <div className={styles.card}>
        
        {/* SOL */}
        <div className={styles.left}>
          <img src="/Registercat.png" alt="cat" className={styles.cat} />

          <div className={styles.petCard}>
            <div className={styles.avatar}>
              <img src="/cat.svg" alt="cat avatar" />
            </div>

            <div>
              <div className={styles.petHeader}>
                <span className={styles.name}>Jack</span>
                <span className={styles.birthday}>
                  Birthday: 18.10.2021
                </span>
              </div>

              <p className={styles.desc}>
                Jack is a gray Persian cat with green eyes. He loves to be pampered and groomed.
              </p>
            </div>
          </div>
        </div>

        {/* SAĞ */}
        <div className={styles.right}>
          <div className={styles.formBox}>
            <h1>Registration</h1>
            <p>Thank you for your interest in our platform.</p>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              
              {/* NAME */}
              <div className={styles.inputGroup}>
                <input
                  {...register('name')}
                  placeholder="Name"
                  className={`${styles.input} ${errors.name ? styles.error : ''}`}
                />
                {errors.name && (
                  <span className={styles.errorText}>{errors.name.message}</span>
                )}
              </div>

              {/* EMAIL */}
              <div className={styles.inputGroup}>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Email"
                  className={`${styles.input} ${errors.email ? styles.error : ''}`}
                />
                {errors.email && (
                  <span className={styles.errorText}>{errors.email.message}</span>
                )}
              </div>

              {/* PASSWORD */}
              <div className={styles.inputGroup}>
                <div className={styles.passwordWrapper}>
                  <input
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    className={`${styles.input} ${errors.password ? styles.error : ''}`}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPass(!showPass)}
                  >
                    <img src={showPass ? '/eye-off.svg' : '/eye.svg'} alt="" />
                  </button>
                </div>
                {errors.password && (
                  <span className={styles.errorText}>{errors.password.message}</span>
                )}
              </div>

              {/* CONFIRM */}
              <div className={styles.inputGroup}>
                <div className={styles.passwordWrapper}>
                  <input
                    {...register('confirmPassword')}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm password"
                    className={`${styles.input} ${
                      errors.confirmPassword ? styles.error : ''
                    }`}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    <img src={showConfirm ? '/eye-off.svg' : '/eye.svg'} alt="" />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className={styles.errorText}>
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={styles.registerBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? '...' : 'REGISTRATION'}
              </button>
            </form>

            <p className={styles.loginLink}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}