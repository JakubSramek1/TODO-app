import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import LoginPanel from './components/LoginPanel';
import AppHeader from '../../components/ui/AppHeader';
import {useAuth} from './AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const {accessToken} = useAuth();

  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  return (
    <>
      <AppHeader />
      <LoginPanel />
    </>
  );
};

export default Login;
