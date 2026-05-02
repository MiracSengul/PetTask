import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const { isLoggedIn } = useSelector((s) => s.auth);
  return isLoggedIn ? <Navigate to="/profile" replace /> : children;
}
