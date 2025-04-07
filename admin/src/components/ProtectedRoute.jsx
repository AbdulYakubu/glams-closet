import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ token, redirectPath = '/' }) => {
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;