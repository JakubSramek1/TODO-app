import {Box} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import AppHeader from '../components/ui/AppHeader';
import CardWrapper from '../components/ui/CardWrapper';
import NewTaskForm from './components/NewTaskForm';
import TodoOverview from './components/TodoOverview';
import {TodoProvider, useTodos} from '../features/todos/TodoContext';
import EditTaskForm from './components/EditTaskForm';
import {useAppDispatch} from '../hooks';
import {logout} from '../features/auth/authSlice';
import {useCallback} from 'react';
import AppButton from '../components/ui/AppButton';
import TodoErrorAlert from './components/TodoErrorAlert';

const HomeContent = () => {
  const {isCreatingTask, editingTodo, closeEditTask, error, clearError} = useTodos();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const renderContent = useCallback(() => {
    if (isCreatingTask) {
      return <NewTaskForm />;
    }

    if (editingTodo) {
      return <EditTaskForm todo={editingTodo} onClose={closeEditTask} />;
    }

    return <TodoOverview />;
  }, [isCreatingTask, editingTodo, closeEditTask]);

  const handleLogout = useCallback(() => {
    void dispatch(logout());
  }, [dispatch]);

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <AppHeader />
      <Box flex="1" px={{base: 4, md: 10}} py={{base: 6, md: 10}}>
        <Box maxW="45rem" mx="auto" display="flex" flexDirection="column" gap={4}>
          {error ? <TodoErrorAlert message={error} onDismiss={clearError} /> : null}
          <CardWrapper w="full" p={{base: 6, md: 10}} gap={{base: 6, md: 10}}>
            {renderContent()}
          </CardWrapper>
        </Box>
        {!editingTodo && !isCreatingTask && (
          <Box mt={4} display="flex" justifyContent="center">
            <AppButton onClick={handleLogout} w={{base: 'full', sm: 'auto'}}>
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
