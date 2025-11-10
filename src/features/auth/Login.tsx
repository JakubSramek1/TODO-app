import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppSelector} from '../../hooks';
import LoginPanel from './components/LoginPanel';
import AppHeader from '../../components/ui/AppHeader';

const Login = () => {
  const navigate = useNavigate();
  const {accessToken} = useAppSelector(({auth}) => auth);

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
