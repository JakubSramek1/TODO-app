import {Icon, IconButton, Menu, Portal, Text} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import {ReactComponent as IconEdit} from '../../assets/icons/icon-edit.svg';
import {ReactComponent as IconDelete} from '../../assets/icons/icon-delete.svg';
import {ReactComponent as IconMore} from '../../assets/icons/icon-more.svg';
import {useTodos} from '../../features/todos/TodoContext';
import {useMutation} from '@tanstack/react-query';
import {useTodoMutation} from '../../features/todos/utils/executeTodoMutation';
import {useCallback} from 'react';
import {deleteTodo} from '../../api/todoApi';

type TodoMenuProps = {
  todoId: string;
};

const TodoMenu = ({todoId}: TodoMenuProps) => {
  const {openEditTask} = useTodos();
  const {t} = useTranslation();

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
  });

  const handleDelete = useCallback(async () => {
    await useTodoMutation(deleteTodoMutation.mutateAsync, todoId);
  }, [deleteTodoMutation]);

  const handleEdit = () => {
    openEditTask(todoId);
  };

  return (
    <Menu.Root>
      {/* @ts-ignore - Menu.Trigger is not typed properly */}
      <Menu.Trigger asChild>
        <IconButton
          aria-label={t('todoMenu.actions')}
          variant="ghost"
          rounded="full"
          minW="8"
          h="8"
        >
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
                {t('todoMenu.edit')}
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
              <Text color="text-danger">{t('todoMenu.delete')}</Text>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default TodoMenu;
