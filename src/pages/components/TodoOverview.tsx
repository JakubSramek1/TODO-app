import {Text} from '@chakra-ui/react';
import HomeEmptyState from './HomeEmptyState';
import TodosList from './TodosList';
import {useTodos} from '../../features/todos/TodoContext';

const TodoOverview = () => {
  const {todos, isLoading} = useTodos();

  if (isLoading) {
    return <Text color="text-secondary">Loading tasks…</Text>;
  }

  if (todos.length === 0) {
    return <HomeEmptyState />;
  }

  return <TodosList />;
};

export default TodoOverview;
