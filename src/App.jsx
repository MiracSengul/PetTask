import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { fetchCurrentUser } from './redux/slices/authSlice';

import Header from './components/Header/Header';
import Loader from './components/common/Loader';
import PrivateRoute from './components/common/PrivateRoute';
import PublicRoute from './components/common/PublicRoute';

import HomePage from './pages/Home/HomePage';
import NewsPage from './pages/News/NewsPage';
import NoticesPage from './pages/Notices/NoticesPage';
import FriendsPage from './pages/Friends/FriendsPage';
import RegisterPage from './pages/Register/RegisterPage';
import LoginPage from './pages/Login/LoginPage';
import ProfilePage from './pages/Profile/ProfilePage';
import AddPetPage from './pages/AddPet/AddPetPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

export default function App() {
  const dispatch = useDispatch();
  const { isLoading, token } = useSelector((s) => s.auth);
  const [showSplash, setShowSplash] = useState(true);

  // Token varsa kullanıcı bilgisini çek
  useEffect(() => {
    if (token) dispatch(fetchCurrentUser());
  }, [dispatch, token]);

  // 3 saniye splash göster, ardından uygulamayı aç
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Yükleniyor veya splash ekranı aktifse sadece Loader'ı göster
  if (showSplash || isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/friends" element={<FriendsPage />} />

        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/add-pet" element={<PrivateRoute><AddPetPage /></PrivateRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
    </>
  );
}