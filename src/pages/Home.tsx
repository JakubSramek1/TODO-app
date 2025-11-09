import {Box, Button} from '@chakra-ui/react';
import AppHeader from '../components/ui/AppHeader';
import CardWrapper from '../components/ui/CardWrapper';
import NewTaskForm from './components/NewTaskForm';
import TodoOverview from './components/TodoOverview';
import {TodoProvider, useTodos} from '../features/todos/TodoContext';
import EditTaskForm from './components/EditTaskForm';
import {useAppDispatch} from '../hooks';
import {logout} from '../features/auth/authSlice';
import {useCallback} from 'react';

const HomeContent = () => {
  const {isCreatingTask, editingTodo, closeEditTask} = useTodos();
  const dispatch = useAppDispatch();

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
        <CardWrapper w="full" maxW="45rem" mx="auto" p={{base: 6, md: 10}} gap={{base: 6, md: 10}}>
          {renderContent()}
        </CardWrapper>
        {!editingTodo && !isCreatingTask && (
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              onClick={handleLogout}
              bg="fill-brand"
              color="text-white"
              borderRadius="full"
              _hover={{bg: 'fill-brand-hover'}}
              _active={{bg: 'fill-brand-hover'}}
              w={{base: 'full', sm: 'auto'}}
            >
              Logout
            </Button>
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
