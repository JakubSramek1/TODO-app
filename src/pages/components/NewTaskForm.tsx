import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import TaskForm, {TaskFormValues} from './TaskForm';
import {useTodos} from '../../features/todos/TodoContext';

const initialValues: TaskFormValues = {
  title: '',
  description: '',
};

const NewTaskForm = () => {
  const {createTodo, closeCreateTask} = useTodos();
  const {t} = useTranslation();

  const handleSubmit = useCallback(
    async (values: TaskFormValues) => {
      await createTodo(values);
    },
    [createTodo]
  );

  return (
    <TaskForm
      heading={t('newTask.heading')}
      submitLabel={t('common.buttons.createTask')}
      cancelLabel={t('common.buttons.discard')}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={closeCreateTask}
    />
  );
};

export default NewTaskForm;
