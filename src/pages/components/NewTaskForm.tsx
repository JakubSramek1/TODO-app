import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import TaskForm, {TaskFormValues} from './TaskForm';
import {useTodos} from '../../features/todos/TodoContext';
import {CreateTodoPayload} from '../../features/todos/types';
import {useTodoMutation} from '../../features/todos/utils/executeTodoMutation';
import {useMutation} from '@tanstack/react-query';
import {createTodo as createTodoRequest} from '../../api/todoApi';

const initialValues: TaskFormValues = {
  title: '',
  description: '',
};

const NewTaskForm = () => {
  const {closeCreateTask} = useTodos();
  const {t} = useTranslation();

  const createTodoMutation = useMutation({
    mutationFn: createTodoRequest,
  });

  const handleSubmit = useCallback(
    async (payload: CreateTodoPayload) => {
      await useTodoMutation(
        createTodoMutation.mutateAsync,
        {
          title: payload.title,
          description: payload.description ?? '',
        },
        closeCreateTask
      );
    },
    [closeCreateTask, createTodoMutation]
  );

  return (
    <TaskForm
      heading={t('newTask.heading')}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={closeCreateTask}
    />
  );
};

export default NewTaskForm;
