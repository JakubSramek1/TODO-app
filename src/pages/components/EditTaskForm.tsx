import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import TaskForm, {TaskFormValues} from './TaskForm';
import type {TodoSummary} from '../../features/todos/types';
import {useTodos} from '../../features/todos/TodoContext';

interface EditTaskFormProps {
  todo: TodoSummary;
  onClose: () => void;
}

const EditTaskForm = ({todo, onClose}: EditTaskFormProps) => {
  const {updateTodo} = useTodos();
  const {t} = useTranslation();

  const initialValues: TaskFormValues = {
    title: todo.title,
    description: todo.description ?? '',
  };

  const handleSubmit = useCallback(
    async (values: TaskFormValues) => {
      await updateTodo(todo.id, values);
    },
    [todo.id, updateTodo]
  );

  return (
    <TaskForm
      heading={t('editTask.heading')}
      submitLabel={t('common.buttons.saveChanges')}
      cancelLabel={t('common.buttons.discardChanges')}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={onClose}
    />
  );
};

export default EditTaskForm;
