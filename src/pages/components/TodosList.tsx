import {Box, IconButton, Stack, Text} from '@chakra-ui/react';
import HomePanelHeader from './HomePanelHeader';
import {ReactComponent as IconMore} from '../../assets/icons/icon-more.svg';
import TodoStatusCheckbox from './TodoStatusCheckbox';
import {useTodos} from '../../features/todos/TodoContext';
import type {TodoSummary} from '../../features/todos/types';

const TodosList = () => {
  const {todos} = useTodos();
  const pending = todos.filter((todo) => !todo.completed);
  const completed = todos.filter((todo) => todo.completed);

  return (
    <Box display="flex" flexDirection="column" gap={10}>
      <HomePanelHeader />
      <TaskSection title="To-do" items={pending} />
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
  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Text fontSize="heading.3" fontWeight="heading.2">
        {title}
      </Text>
      <Stack gap={0}>
        {items.length === 0 ? (
          <Box py={6} px={4} textAlign="center" color="text-tertiary">
            No tasks here yet.
          </Box>
        ) : (
          items.map((item) => (
            <Box key={item.id}>
              <TaskRow todo={item} completed={completed} onToggleStatus={toggleTodoStatus} />
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
};

interface TaskRowProps {
  todo: TodoSummary;
  completed: boolean;
  onToggleStatus: (todo: TodoSummary, completed: boolean) => void;
}

const TaskRow = ({todo, completed, onToggleStatus}: TaskRowProps) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" py={4} px={6} gap={4}>
    <Stack direction="row" alignItems="center" gap={4} flex="1">
      <TodoStatusCheckbox
        checked={completed}
        label={todo.title}
        onChange={(next) => onToggleStatus(todo, next)}
      />
      <Box>
        <Text fontWeight="heading.2" color="text-primary">
          {todo.title}
        </Text>
        {todo.description ? (
          <Text fontSize="text.small" color="text-tertiary">
            {todo.description}
          </Text>
        ) : null}
      </Box>
    </Stack>
    <IconButton aria-label="Task actions" variant="ghost" rounded="full" minW="32px" h="32px">
      <Box as={IconMore} />
    </IconButton>
  </Box>
);

export default TodosList;
