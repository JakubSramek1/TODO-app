import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import TaskForm, {TaskFormValues} from './TaskForm';
import {createTodo as createTodoRequest} from '../../api/todoApi';
import {useTodoMutation} from '../../features/todos/utils/executeTodoMutation';

const initialValues: TaskFormValues = {
  title: '',
  description: '',
};

const NewTaskForm = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/');
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
