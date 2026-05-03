import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clientLogout, logout } from '../../redux/slices/authSlice';
import ModalApproveAction from '../Modals/ModalApproveAction';
import styles from './Header.module.css';

export default function Header() {
  const { isLoggedIn, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(clientLogout());
    navigate('/home');
    setShowLogout(false);
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/news', label: 'News' },
    { to: '/notices', label: 'Find pet' },
    { to: '/friends', label: 'Our friends' },
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.inner}`}>
          <Link to="/home" className={styles.logo}>
            petl<span style={{ color: '#fff' }}>♥</span>ve
          </Link>

          <nav className={styles.nav}>
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              >{l.label}</NavLink>
            ))}
          </nav>

          <div className={styles.authArea}>
            {!isLoggedIn ? (
              <>
                <Link to="/login" className={styles.authBtnLogin}>LOGIN</Link>
                <Link to="/register" className={styles.authBtnRegister}>REGISTRATION</Link>
              </>
            ) : (
              <>
                <button className={styles.authBtnLogout} onClick={() => setShowLogout(true)}>LOGOUT</button>
                <Link to="/profile" className={styles.userBar}>
                  {user?.avatar
                    ? <img src={user.avatar} alt="avatar" className={styles.avatar} />
                    : <div className={styles.avatarDefault}>👤</div>
                  }
                  <span>{user?.name || 'Profile'}</span>
                </Link>
              </>
            )}
          </div>

          <button className={styles.burger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <button className={styles.mobileClose} onClick={() => setMenuOpen(false)}>✕</button>
          <nav className={styles.mobileNav}>
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >{l.label}</NavLink>
            ))}
          </nav>
          <div className={styles.mobileAuth}>
            {!isLoggedIn ? (
              <>
                <Link to="/login" className={styles.authBtnLogin} onClick={() => setMenuOpen(false)}>LOGIN</Link>
                <Link to="/register" className={styles.authBtnRegister} onClick={() => setMenuOpen(false)}>REGISTRATION</Link>
              </>
            ) : (
              <>
                <button className={styles.authBtnLogout} onClick={() => { setShowLogout(true); setMenuOpen(false); }}>LOGOUT</button>
                <Link to="/profile" className={styles.userBar} onClick={() => setMenuOpen(false)}>
                  {user?.avatar
                    ? <img src={user.avatar} alt="avatar" className={styles.avatar} />
                    : <div className={styles.avatarDefault}>👤</div>
                  }
                  <span>{user?.name}</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {showLogout && (
        <ModalApproveAction
          onClose={() => setShowLogout(false)}
          onConfirm={handleLogout}
          question="Hesabınızdan çıkış yapmak istediğinizden emin misiniz?"
        />
      )}
    </>
  );
}
