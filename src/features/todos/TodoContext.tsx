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
import i18n from '../../i18n/i18n';

interface TodoContextValue {
  todos: TodoSummary[];
  isLoading: boolean;
  isCreatingTask: boolean;
  editingTodoId: string | null;
  editingTodo: TodoSummary | null;
  openCreateTask: () => void;
  closeCreateTask: () => void;
  openEditTask: (todo: TodoSummary) => void;
  closeEditTask: () => void;
  createTodo: (payload: CreateTodoPayload) => Promise<void>;
  updateTodo: (id: string, payload: CreateTodoPayload) => Promise<void>;
  toggleTodoStatus: (todo: TodoSummary, completed: boolean) => Promise<void>;
  deleteTodo: (todo: TodoSummary) => Promise<void>;
  refreshTodos: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export const TodoProvider = ({children}: {children: ReactNode}) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [todos, setTodos] = useState<TodoSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    if (!accessToken) {
      setTodos([]);
      setEditingTodo(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.get<{todos: TodoSummary[]}>('/todo/list', {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      const nextTodos = response.data.todos ?? [];
      setTodos(nextTodos);
      setEditingTodo((current) => {
        setError(null);
        if (!current) return null;
        return nextTodos.find((todo) => todo.id === current.id) ?? null;
      });
    } catch (error) {
      console.error('Failed to load todos', error);
      setTodos([]);
      setEditingTodo(null);
      setError(i18n.t('todos.errors.fetchFailed'));
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

  const openEditTask = useCallback((todo: TodoSummary) => {
    setEditingTodo(todo);
  }, []);

  const closeEditTask = useCallback(() => {
    setEditingTodo(null);
  }, []);

  const createTodo = useCallback(
    async (payload: CreateTodoPayload) => {
      if (!accessToken) {
        return;
      }

      setError(null);
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
        setError(null);
      } catch (error) {
        console.error('Failed to create task', error);
        setError(i18n.t('todos.errors.createFailed'));
        throw error;
      }
    },
    [accessToken, fetchTodos, closeCreateTask]
  );

  const updateTodo = useCallback(
    async (id: string, payload: CreateTodoPayload) => {
      if (!accessToken) {
        return;
      }

      setError(null);
      try {
        await apiClient.put(
          `/todo/${id}`,
          {
            title: payload.title,
            description: payload.description ?? '',
          },
          {headers: {Authorization: `Bearer ${accessToken}`}}
        );
        await fetchTodos();
        closeEditTask();
        setError(null);
      } catch (error) {
        console.error('Failed to update task', error);
        await fetchTodos();
        setError(i18n.t('todos.errors.updateFailed'));
        throw error;
      }
    },
    [accessToken, fetchTodos, closeEditTask]
  );

  const toggleTodoStatus = useCallback(
    async (todo: TodoSummary, completed: boolean) => {
      if (!accessToken) {
        return;
      }

      setError(null);
      setTodos((prev) => prev.map((item) => (item.id === todo.id ? {...item, completed} : item)));
      try {
        const endpoint = `/todo/${todo.id}/${completed ? 'complete' : 'incomplete'}`;
        await apiClient.post(endpoint, {}, {headers: {Authorization: `Bearer ${accessToken}`}});
        setError(null);
      } catch (error) {
        console.error('Failed to update task status', error);
        await fetchTodos();
        setError(i18n.t('todos.errors.toggleFailed'));
      }
    },
    [accessToken, fetchTodos]
  );

  const deleteTodo = useCallback(
    async (todo: TodoSummary) => {
      if (!accessToken) {
        return;
      }

      setError(null);
      setTodos((prev) => prev.filter((item) => item.id !== todo.id));
      setEditingTodo((current) => (current?.id === todo.id ? null : current));
      try {
        await apiClient.delete(`/todo/${todo.id}`, {
          headers: {Authorization: `Bearer ${accessToken}`},
        });
        setError(null);
      } catch (error) {
        console.error('Failed to delete task', error);
        await fetchTodos();
        setError(i18n.t('todos.errors.deleteFailed'));
      }
    },
    [accessToken, fetchTodos]
  );

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<TodoContextValue>(
    () => ({
      todos,
      isLoading,
      isCreatingTask,
      editingTodoId: editingTodo?.id ?? null,
      editingTodo,
      openCreateTask,
      closeCreateTask,
      openEditTask,
      closeEditTask,
      createTodo,
      updateTodo,
      toggleTodoStatus,
      deleteTodo,
      refreshTodos: fetchTodos,
      error,
      clearError,
    }),
    [
      todos,
      isLoading,
      isCreatingTask,
      editingTodo,
      openCreateTask,
      closeCreateTask,
      openEditTask,
      closeEditTask,
      createTodo,
      updateTodo,
      toggleTodoStatus,
      deleteTodo,
      fetchTodos,
      error,
      clearError,
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
