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
    { to: '/notices', label: 'Notices' },
    { to: '/friends', label: 'Our Friends' },
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.inner}`}>
          <Link to="/home" className={styles.logo}>
            <span className={styles.logoIcon}>🐾</span>
            <span>petlove</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav}>
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              >{l.label}</NavLink>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className={styles.authArea}>
            {!isLoggedIn ? (
              <>
                <Link to="/register" className={`btn btn-outline ${styles.authBtn}`}>Register</Link>
                <Link to="/login" className={`btn btn-primary ${styles.authBtn}`}>Log In</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className={styles.userBar}>
                  {user?.avatar
                    ? <img src={user.avatar} alt="avatar" className={styles.avatar} />
                    : <div className={styles.avatarDefault}>👤</div>
                  }
                  <span>{user?.name || 'Profil'}</span>
                </Link>
                <button className={`btn btn-ghost ${styles.authBtn}`} onClick={() => setShowLogout(true)}>Log Out</button>
              </>
            )}
          </div>

          {/* Burger */}
          <button className={styles.burger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
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
                <Link to="/register" className="btn btn-outline" onClick={() => setMenuOpen(false)}>Register</Link>
                <Link to="/login" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Log In</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className={styles.userBar} onClick={() => setMenuOpen(false)}>
                  {user?.avatar
                    ? <img src={user.avatar} alt="avatar" className={styles.avatar} />
                    : <div className={styles.avatarDefault}>👤</div>
                  }
                  <span>{user?.name || 'Profil'}</span>
                </Link>
                <button className="btn btn-ghost" onClick={() => { setShowLogout(true); setMenuOpen(false); }}>Log Out</button>
              </>
            )}
          </div>
        </div>
      )}

      {showLogout && (
        <ModalApproveAction
          onClose={() => setShowLogout(false)}
          onConfirm={handleLogout}
          question="Çıkış yapmak istediğinizden emin misiniz?"
        />
      )}
    </>
  );
}
