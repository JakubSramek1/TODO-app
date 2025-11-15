import {Box, Separator, Stack, Text} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import HomePanelHeader from './HomePanelHeader';
import type {TodoSummary} from '../../features/todos/types';
import HomeEmptyState from './HomeEmptyState';
import TaskRow from './TaskRow';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useAuth} from '../../features/auth/AuthContext';
import {
  TODO_LIST_QUERY_KEY,
  TOGGLE_TODO_STATUS_QUERY_KEY,
  toggleTodoStatus as toggleTodoStatusRequest,
} from '../../api/todoApi';

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
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const {accessToken} = useAuth();

  const toggleTodoStatusMutation = useMutation({
    mutationFn: ({id, completed}: {id: string; completed: boolean}) =>
      toggleTodoStatusRequest(id, completed),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: [TOGGLE_TODO_STATUS_QUERY_KEY]});
      await queryClient.refetchQueries({queryKey: [TODO_LIST_QUERY_KEY]});
    },
  });

  const toggleTodoStatus = async (todo: TodoSummary, completed: boolean) => {
    if (!accessToken) {
      return;
    }

    try {
      await toggleTodoStatusMutation.mutateAsync({
        id: todo.id,
        completed,
      });
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

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
