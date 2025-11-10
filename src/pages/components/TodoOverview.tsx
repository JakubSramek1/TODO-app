import {Text} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import HomeEmptyState from './HomeEmptyState';
import TodosList from './TodosList';
import {useTodos} from '../../features/todos/TodoContext';

const TodoOverview = () => {
  const {todos, isLoading} = useTodos();
  const {t} = useTranslation();

  if (isLoading) {
    return <Text color="text-secondary">{t('todos.loading')}</Text>;
  }

  if (todos.length === 0) {
    return <HomeEmptyState />;
  }

  return <TodosList />;
};

export default TodoOverview;
