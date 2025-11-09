import {Icon, IconButton, Menu, Portal, Text} from '@chakra-ui/react';
import {ReactComponent as IconEdit} from '../../assets/icons/icon-edit.svg';
import {ReactComponent as IconDelete} from '../../assets/icons/icon-delete.svg';
import {ReactComponent as IconMore} from '../../assets/icons/icon-more.svg';
import {TodoSummary} from '../../features/todos/types';
import {useTodos} from '../../features/todos/TodoContext';

const TodoMenu = ({todo}: {todo: TodoSummary}) => {
  const {deleteTodo, openEditTask} = useTodos();

  const handleDelete = async () => {
    await deleteTodo(todo);
  };

  const handleEdit = () => {
    openEditTask(todo);
  };

  return (
    <Menu.Root>
      {/* @ts-ignore - Menu.Trigger is not typed properly */}
      <Menu.Trigger asChild>
        <IconButton aria-label="Task actions" variant="ghost" rounded="full" minW="8" h="8">
          <Icon as={IconMore} boxSize={4} />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        {/* @ts-ignore - Menu.Trigger is not typed properly */}
        <Menu.Positioner>
          {/* @ts-ignore - Menu.Trigger is not typed properly */}
          <Menu.Content rounded="2xl" minW="13.5rem" py={2}>
            {/* @ts-ignore - Menu.Trigger is not typed properly */}
            <Menu.Item value="edit" gap={3} py={2} onClick={handleEdit}>
              <IconEdit />
              <Text fontSize="text.base" fontWeight="text.base" color="text-primary">
                Edit
              </Text>
            </Menu.Item>
            {/* @ts-ignore - Menu.Trigger is not typed properly */}
            <Menu.Item
              value="delete"
              gap={3}
              css={{'& svg path': {fill: 'text-danger'}}}
              py={2}
              onClick={handleDelete}
            >
              <Icon as={IconDelete} boxSize={4} />
              <Text color="text-danger">Delete</Text>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default TodoMenu;
