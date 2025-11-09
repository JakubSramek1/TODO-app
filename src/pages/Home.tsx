import {Box} from '@chakra-ui/react';
import AppHeader from '../components/ui/AppHeader';
import CardWrapper from '../components/ui/CardWrapper';
import NewTaskForm from './components/NewTaskForm';
import TodoOverview from './components/TodoOverview';
import {TodoProvider, useTodos} from '../features/todos/TodoContext';
import EditTaskForm from './components/EditTaskForm';

const HomeContent = () => {
  const {isCreatingTask, editingTodo, closeEditTask} = useTodos();

  const renderContent = () => {
    if (isCreatingTask) {
      return <NewTaskForm />;
    }

    if (editingTodo) {
      return <EditTaskForm todo={editingTodo} onClose={closeEditTask} />;
    }

    return <TodoOverview />;
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <AppHeader />
      <Box flex="1" px={{base: 4, md: 10}} py={{base: 6, md: 10}}>
        <CardWrapper w="full" maxW="720px" mx="auto" p={{base: 6, md: 10}} gap={{base: 6, md: 10}}>
          {renderContent()}
        </CardWrapper>
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
