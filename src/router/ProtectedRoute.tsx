import {ReactNode} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAppSelector} from '../hooks';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{from: location}} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
