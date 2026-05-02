import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const { isLoggedIn, token } = useSelector((s) => s.auth);
  return (isLoggedIn || token) ? children : <Navigate to="/login" replace />;
}
