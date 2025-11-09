import AppHeader from '../components/ui/AppHeader';
import CardWrapper from '../components/ui/CardWrapper';
import NewTaskForm from './components/NewTaskForm';
import TodoOverview from './components/TodoOverview';
import {TodoProvider, useTodos} from '../features/todos/TodoContext';

const HomeContent = () => {
  const {isCreatingTask} = useTodos();

  return (
    <>
      <AppHeader />
      <CardWrapper mx={10} spaceY={10} as="section">
        {isCreatingTask ? <NewTaskForm /> : <TodoOverview />}
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
