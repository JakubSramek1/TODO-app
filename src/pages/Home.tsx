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
    <>
      <AppHeader />
      <CardWrapper mx={10} spaceY={10} as="section">
        {renderContent()}
      </CardWrapper>
    </>
  );
};

const Home = () => (
  <TodoProvider>
    <HomeContent />
  </TodoProvider>
);

export default Home;
