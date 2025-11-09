import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import apiClient from '../../api/apiClient';
import {useAppSelector} from '../../hooks';
import type {CreateTodoPayload, TodoSummary} from './types';

interface TodoContextValue {
  todos: TodoSummary[];
  isLoading: boolean;
  isCreatingTask: boolean;
  openCreateTask: () => void;
  closeCreateTask: () => void;
  createTodo: (payload: CreateTodoPayload) => Promise<void>;
  toggleTodoStatus: (todo: TodoSummary, completed: boolean) => Promise<void>;
  deleteTodo: (todo: TodoSummary) => Promise<void>;
  refreshTodos: () => Promise<void>;
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export const TodoProvider = ({children}: {children: ReactNode}) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [todos, setTodos] = useState<TodoSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const fetchTodos = useCallback(async () => {
    if (!accessToken) {
      setTodos([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.get<{todos: TodoSummary[]}>('/todo/list', {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      setTodos(response.data.todos ?? []);
    } catch (error) {
      console.error('Failed to load todos', error);
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void fetchTodos();
  }, [fetchTodos]);

  const openCreateTask = useCallback(() => {
    setIsCreatingTask(true);
  }, []);

  const closeCreateTask = useCallback(() => {
    setIsCreatingTask(false);
  }, []);

  const createTodo = useCallback(
    async (payload: CreateTodoPayload) => {
      if (!accessToken) {
        return;
      }

      try {
        await apiClient.post(
          '/todo',
          {
            title: payload.title,
            description: payload.description ?? '',
          },
          {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        closeCreateTask();
        await fetchTodos();
      } catch (error) {
        console.error('Failed to create task', error);
      }
    },
    [accessToken, fetchTodos, closeCreateTask]
  );

  const toggleTodoStatus = useCallback(
    async (todo: TodoSummary, completed: boolean) => {
      if (!accessToken) {
        return;
      }

      setTodos((prev) => prev.map((item) => (item.id === todo.id ? {...item, completed} : item)));
      try {
        const endpoint = `/todo/${todo.id}/${completed ? 'complete' : 'incomplete'}`;
        await apiClient.post(endpoint, {}, {headers: {Authorization: `Bearer ${accessToken}`}});
      } catch (error) {
        console.error('Failed to update task status', error);
        await fetchTodos();
      }
    },
    [accessToken, fetchTodos]
  );

  const deleteTodo = useCallback(
    async (todo: TodoSummary) => {
      if (!accessToken) {
        return;
      }

      setTodos((prev) => prev.filter((item) => item.id !== todo.id));
      try {
        await apiClient.delete(`/todo/${todo.id}`, {
          headers: {Authorization: `Bearer ${accessToken}`},
        });
      } catch (error) {
        console.error('Failed to delete task', error);
        await fetchTodos();
      }
    },
    [accessToken, fetchTodos]
  );

  const value = useMemo<TodoContextValue>(
    () => ({
      todos,
      isLoading,
      isCreatingTask,
      openCreateTask,
      closeCreateTask,
      createTodo,
      toggleTodoStatus,
      deleteTodo,
      refreshTodos: fetchTodos,
    }),
    [
      todos,
      isLoading,
      isCreatingTask,
      openCreateTask,
      closeCreateTask,
      createTodo,
      toggleTodoStatus,
      deleteTodo,
      fetchTodos,
    ]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};
