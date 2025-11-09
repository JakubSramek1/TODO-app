import {useEffect, useState} from 'react';
import AppHeader from '../components/ui/AppHeader';
import CardWrapper from '../components/ui/CardWrapper';
import NewTaskForm from './components/NewTaskForm';
import apiClient from '../api/apiClient';
import {useAppSelector} from '../hooks';
import TodoOverview, {TodoSummary} from './components/TodoOverview';

const Home = () => {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [todos, setTodos] = useState<TodoSummary[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const fetchTodos = async () => {
    if (!accessToken) {
      setTodos([]);
      return;
    }

    setIsLoadingTodos(true);
    try {
      const response = await apiClient.get<{todos: TodoSummary[]}>('/todo/list', {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      setTodos(response.data.todos ?? []);
    } catch (error) {
      console.error('Failed to load todos', error);
      setTodos([]);
    } finally {
      setIsLoadingTodos(false);
    }
  };

  useEffect(() => {
    void fetchTodos();
  }, [accessToken]);

  const handleAddTask = () => {
    setIsCreatingTask(true);
  };

  const handleCloseForm = () => {
    setIsCreatingTask(false);
    void fetchTodos();
  };

  const handleToggleStatus = async (todo: TodoSummary, completed: boolean) => {
    if (!accessToken) {
      return;
    }

    try {
      const endpoint = `/todo/${todo.id}/${completed ? 'complete' : 'incomplete'}`;
      await apiClient.post(endpoint, {}, {headers: {Authorization: `Bearer ${accessToken}`}});
      setTodos((prev) =>
        prev.map((item) => (item.id === todo.id ? {...item, completed} : item))
      );
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  return (
    <>
      <AppHeader />
      <CardWrapper mx={10} spaceY={10} as="section">
        {isCreatingTask ? (
          <NewTaskForm onClose={handleCloseForm} />
        ) : (
          <TodoOverview
            todos={todos}
            isLoading={isLoadingTodos}
            onAddTask={handleAddTask}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </CardWrapper>
    </>
  );
};

export default Home;
