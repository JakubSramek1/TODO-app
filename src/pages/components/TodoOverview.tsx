import {Text} from '@chakra-ui/react';
import HomeEmptyState from './HomeEmptyState';
import TodosList from './TodosList';

export interface TodoSummary {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  completed: boolean;
  userId: string;
}

interface TodoOverviewProps {
  todos: TodoSummary[];
  isLoading: boolean;
  onAddTask: () => void;
  onToggleStatus: (todo: TodoSummary, completed: boolean) => void;
}

const TodoOverview = ({todos, isLoading, onAddTask, onToggleStatus}: TodoOverviewProps) => {
  if (isLoading) {
    return <Text color="text-secondary">Loading tasks…</Text>;
  }

  if (todos.length === 0) {
    return <HomeEmptyState onAddTask={onAddTask} />;
  }

  return <TodosList todos={todos} onAddTask={onAddTask} onToggleStatus={onToggleStatus} />;
};

export default TodoOverview;
