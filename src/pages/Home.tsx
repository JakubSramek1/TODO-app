import AppHeader from '../components/ui/AppHeader';
import CardWrapper from '../components/ui/CardWrapper';
import HomePanelHeader from './components/HomePanelHeader';
import HomeEmptyState from './components/HomeEmptyState';

const Home = () => {
  const handleAddTask = () => {
    console.log('add task');
  };

  return (
    <>
      <AppHeader />
      <CardWrapper mx={10} spaceY={10}>
        <HomePanelHeader onAddTask={handleAddTask} />
        <HomeEmptyState />
      </CardWrapper>
    </>
  );
};

export default Home;
