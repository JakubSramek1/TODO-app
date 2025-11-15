import HomeEmptyState from './HomeEmptyState';
import TodosList from './TodosList';
import {fetchTodos, TODO_LIST_QUERY_KEY} from '../../api/todoApi';
import TodosListSkeleton from './TodosListSkeleton';
import {useTodosQuery} from '../../features/todos/useTodosQuery';

const TodoOverview = () => {
  const {
    data: todos = [],
    isPending: isTodosPending,
    // error: todosError,
  } = useTodosQuery(fetchTodos, [TODO_LIST_QUERY_KEY]);

  if (isTodosPending) {
    return <TodosListSkeleton />;
  }

  if (todos.length === 0) {
    return <HomeEmptyState />;
  }

  return <TodosList todos={todos} />;
};

export default TodoOverview;
