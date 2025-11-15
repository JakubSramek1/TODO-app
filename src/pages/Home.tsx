import {Box} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import {Routes, Route, useNavigate, useMatch} from 'react-router-dom';
import AppHeader from '../components/ui/AppHeader';
import CardWrapper from '../components/ui/CardWrapper';
import NewTaskForm from './components/NewTaskForm';
import TodoOverview from './components/TodoOverview';
import {TodoProvider, useTodos} from '../features/todos/TodoContext';
import EditTaskForm from './components/EditTaskForm';
import AppButton from '../components/ui/AppButton';
import TodoErrorAlert from './components/TodoErrorAlert';
import {useAuth} from '../features/auth/AuthContext';
import {useEffect} from 'react';

const HomeContent = () => {
  const {error, clearError} = useTodos();
  const {logout, accessToken} = useAuth();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const isHomePage = useMatch({path: '/', end: true});

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <AppHeader />
      <Box flex="1" px={{base: 4, md: 10}} py={{base: 6, md: 10}}>
        <Box maxW="45rem" mx="auto" display="flex" flexDirection="column" gap={4}>
          {error ? <TodoErrorAlert message={error} onDismiss={clearError} /> : null}
          <CardWrapper w="full" p={{base: 6, md: 10}} gap={{base: 6, md: 10}}>
            <Routes>
              <Route index element={<TodoOverview />} />
              <Route path="new" element={<NewTaskForm />} />
              <Route path=":taskId" element={<EditTaskForm />} />
            </Routes>
          </CardWrapper>
        </Box>
        {isHomePage && (
          <Box mt={4} display="flex" justifyContent="center">
            <AppButton onClick={logout} w={{base: 'full', sm: 'auto'}}>
              {t('common.buttons.logout')}
            </AppButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const Home = () => (
  <TodoProvider>
    <HomeContent />
  </TodoProvider>
);

export default Home;
