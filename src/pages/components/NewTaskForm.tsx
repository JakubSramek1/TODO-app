import {useCallback} from 'react';
import TaskForm, {TaskFormValues} from './TaskForm';
import {useTodos} from '../../features/todos/TodoContext';

const initialValues: TaskFormValues = {
  title: '',
  description: '',
};

const NewTaskForm = () => {
  const {createTodo, closeCreateTask} = useTodos();

  const handleSubmit = useCallback(
    async (values: TaskFormValues) => {
      await createTodo(values);
    },
    [createTodo]
  );

  return (
    <TaskForm
      heading="New task"
      submitLabel="Create task"
      cancelLabel="Discard"
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={closeCreateTask}
    />
  );
};

export default NewTaskForm;
