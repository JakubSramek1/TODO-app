import {useState} from 'react';
import AppHeader from '../components/ui/AppHeader';
import CardWrapper from '../components/ui/CardWrapper';
import HomePanelHeader from './components/HomePanelHeader';
import HomeEmptyState from './components/HomeEmptyState';
import NewTaskForm from './components/NewTaskForm';

const Home = () => {
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  return (
    <>
      <AppHeader />
      <CardWrapper mx={10} spaceY={10} as="section">
        {isCreatingTask ? (
          <NewTaskForm onClose={() => setIsCreatingTask(false)} />
        ) : (
          <>
            <HomePanelHeader onAddTask={() => setIsCreatingTask(true)} />
            <HomeEmptyState />
          </>
        )}
      </CardWrapper>
    </>
  );
};

export default Home;
