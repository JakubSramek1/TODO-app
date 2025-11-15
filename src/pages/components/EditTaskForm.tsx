import {useTranslation} from 'react-i18next';
import TaskForm, {TaskFormValues} from './TaskForm';
import {fetchTodo, updateTodo as updateTodoRequest} from '../../api/todoApi';
import {useTodos} from '../../features/todos/TodoContext';
import {useTodosQuery} from '../../features/todos/useTodosQuery';
import TodosListSkeleton from './TodosListSkeleton';
import {useTodoMutation} from '../../features/todos/utils/executeTodoMutation';

interface EditTaskFormProps {
  todoId: string;
  onClose: () => void;
}

const EditTaskForm = ({todoId, onClose}: EditTaskFormProps) => {
  const {t} = useTranslation();
  const {setEditingTodoId} = useTodos();

  const {
    data: todo,
    isLoading: isTodoLoading,
    // error: todosError,
  } = useTodosQuery(() => fetchTodo(todoId), [todoId]);

  const handleCancel = () => {
    setEditingTodoId(null);
  };

  const updateTodoMutation = useTodoMutation(updateTodoRequest, handleCancel);

  const handleSubmit = async (payload: TaskFormValues) => {
    await updateTodoMutation.mutateAsync({
      id: todoId,
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
      onCancel={onClose}
    />
  );
};

export default EditTaskForm;
