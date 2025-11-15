import {Box, Stack, Text} from '@chakra-ui/react';
import TodoStatusCheckbox from './TodoStatusCheckbox';
import TodoMenu from './TodoMenu';
import type {TodoSummary} from '../../features/todos/types';

type TaskRowProps = {
  todo: TodoSummary;
  completed: boolean;
  onToggleStatus: (todo: TodoSummary, completed: boolean) => void;
};

const TaskRow = ({todo, completed, onToggleStatus}: TaskRowProps) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" py={4} gap={4}>
    <Stack direction="row" alignItems="start" gap={4} flex="1">
      <TodoStatusCheckbox
        checked={completed}
        label={todo.title}
        onChange={(completed) => onToggleStatus(todo, completed)}
      />
      <Box>
        <Text fontWeight="heading.2" color="text-primary">
          {todo.title}
        </Text>
        {todo.description ? (
          <Text
            fontSize="text.small"
            color="text-tertiary"
            overflow="hidden"
            display="-webkit-box"
            css={{
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
            }}
          >
            {todo.description}
          </Text>
        ) : null}
      </Box>
    </Stack>
    <TodoMenu todoId={todo.id} />
  </Box>
);

export default TaskRow;
