import {useTranslation} from 'react-i18next';
import {useParams, useNavigate} from 'react-router-dom';
import TaskForm, {TaskFormValues} from './TaskForm';
import {fetchTodo, updateTodo as updateTodoRequest} from '../../api/todoApi';
import {useTodosQuery} from '../../features/todos/useTodosQuery';
import TodosListSkeleton from './TodosListSkeleton';
import {useTodoMutation} from '../../features/todos/utils/executeTodoMutation';

const EditTaskForm = () => {
  const {t} = useTranslation();
  const {taskId} = useParams<{taskId: string}>();
  const navigate = useNavigate();

  if (!taskId) {
    return null;
  }

  const {
    data: todo,
    isLoading: isTodoLoading,
    // error: todosError,
  } = useTodosQuery(() => fetchTodo(taskId), [taskId]);

  const handleCancel = () => {
    navigate('/');
  };

  const updateTodoMutation = useTodoMutation(updateTodoRequest, handleCancel);

  const handleSubmit = async (payload: TaskFormValues) => {
    await updateTodoMutation.mutateAsync({
      id: taskId,
      title: payload.title,
      description: payload.description ?? '',
    });
  };

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

  return (
    <TaskForm
      heading={t('editTask.heading')}
      isEdited
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default EditTaskForm;
