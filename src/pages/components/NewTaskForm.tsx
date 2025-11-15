import {useTranslation} from 'react-i18next';
import TaskForm, {TaskFormValues} from './TaskForm';
import {useTodos} from '../../features/todos/TodoContext';
import {createTodo as createTodoRequest} from '../../api/todoApi';
import {useTodoMutation} from '../../features/todos/utils/executeTodoMutation';

const initialValues: TaskFormValues = {
  title: '',
  description: '',
};

const NewTaskForm = () => {
  const {setEditingTodoId} = useTodos();
  const {t} = useTranslation();

  const handleCancel = () => {
    setEditingTodoId(null);
  };

  const createTodoMutation = useTodoMutation(createTodoRequest, handleCancel);

  const handleSubmit = async (payload: TaskFormValues) => {
    await createTodoMutation.mutateAsync({
      title: payload.title,
      description: payload.description ?? '',
    });
  };

  return (
    <TaskForm
      heading={t('newTask.heading')}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default NewTaskForm;
