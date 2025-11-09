import {Box, Separator, Stack, Text} from '@chakra-ui/react';
import HomePanelHeader from './HomePanelHeader';
import {useTodos} from '../../features/todos/TodoContext';
import type {TodoSummary} from '../../features/todos/types';
import HomeEmptyState from './HomeEmptyState';
import TaskRow from './TaskRow';

const TodosList = () => {
  const {todos} = useTodos();
  const pending = todos.filter((todo) => !todo.completed);
  const completed = todos.filter((todo) => todo.completed);

  return (
    <Box display="flex" flexDirection="column" gap={10}>
      <HomePanelHeader />
      {pending.length > 0 ? <TaskSection title="To-do" items={pending} /> : <HomeEmptyState />}
      <TaskSection title="Completed" items={completed} completed />
    </Box>
  );
};

interface TaskSectionProps {
  title: string;
  items: TodoSummary[];
  completed?: boolean;
}

const TaskSection = ({title, items, completed = false}: TaskSectionProps) => {
  const {toggleTodoStatus} = useTodos();

  if (items.length === 0) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Text fontSize="heading.3" fontWeight="heading.2">
        {title}
      </Text>
      <Separator />
      <Stack gap={0}>
        {items.map((item) => (
          <Box key={item.id}>
            <TaskRow todo={item} completed={completed} onToggleStatus={toggleTodoStatus} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default TodosList;
