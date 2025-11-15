import {Box, Separator, Stack, Text} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import HomePanelHeader from './HomePanelHeader';
import {useTodos} from '../../features/todos/TodoContext';
import type {TodoSummary} from '../../features/todos/types';
import HomeEmptyState from './HomeEmptyState';
import TaskRow from './TaskRow';

type TodosListProps = {
  todos: TodoSummary[];
};

const TodosList = ({todos}: TodosListProps) => {
  const {t} = useTranslation();

  const pending = todos.filter((todo) => !todo.completed);
  const completed = todos.filter((todo) => todo.completed);

  return (
    <Box display="flex" flexDirection="column" gap={{base: 6, md: 10}}>
      <HomePanelHeader />
      {pending.length > 0 ? (
        <TaskSection title={t('todos.sections.todo')} items={pending} />
      ) : (
        <HomeEmptyState todos={todos} />
      )}
      <TaskSection title={t('todos.sections.completed')} items={completed} completed />
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
  const {t} = useTranslation();

  if (items.length === 0) {
    return (
      <Box display="flex" flexDirection="column" gap={4}>
        <Text fontSize="heading.3" fontWeight="heading.2">
          {title}
        </Text>
        <Separator />
        <Box py={6} px={4} textAlign="center" color="text-tertiary">
          {t('todos.empty')}
        </Box>
      </Box>
    );
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
