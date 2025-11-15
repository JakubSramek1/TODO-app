import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import TaskForm, {TaskFormValues} from './TaskForm';
import {useMutation} from '@tanstack/react-query';
import {fetchTodo, updateTodo as updateTodoRequest} from '../../api/todoApi';
import {useTodoMutation} from '../../features/todos/utils/executeTodoMutation';
import {useTodos} from '../../features/todos/TodoContext';
import {useTodosQuery} from '../../features/todos/useTodosQuery';
import TodosListSkeleton from './TodosListSkeleton';

interface EditTaskFormProps {
  todoId: string;
  onClose: () => void;
}

const EditTaskForm = ({todoId, onClose}: EditTaskFormProps) => {
  const {t} = useTranslation();
  const {closeEditTask} = useTodos();

  const {
    data: todo,
    isLoading: isTodoLoading,
    // error: todosError,
  } = useTodosQuery(() => fetchTodo(todoId), [todoId]);

  const updateTodoMutation = useMutation({
    mutationFn: updateTodoRequest,
  });

  const handleSubmit = useCallback(
    async (payload: TaskFormValues) => {
      if (todo) {
        await useTodoMutation(
          updateTodoMutation.mutateAsync,
          {
            id: todoId,
            title: payload.title,
            description: payload.description ?? '',
          },
          closeEditTask
        );
      }
    },
    [updateTodoMutation]
  );

  if (isTodoLoading) {
    return <TodosListSkeleton />;
  }

  if (!todo) {
    return null;
  }

  const initialValues: TaskFormValues = {
    title: todo.title,
    description: todo.description ?? '',
  };

  console.log(todo, initialValues);

  return (
    <TaskForm
      heading={t('editTask.heading')}
      isEdited
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
};

export default EditTaskForm;
