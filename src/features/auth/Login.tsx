import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppSelector} from '../../hooks';
import LoginHeader from './components/LoginHeader';
import LoginPanel from './components/LoginPanel';

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
      <LoginHeader />
      <LoginPanel />
    </>
  );
};

export default Login;
