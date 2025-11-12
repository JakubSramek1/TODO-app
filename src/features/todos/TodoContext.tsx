import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {CreateTodoPayload, TodoSummary} from './types';
import {useAuth} from '../auth/AuthContext';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  createTodo as createTodoRequest,
  deleteTodo as deleteTodoRequest,
  fetchTodos,
  toggleTodoStatus as toggleTodoStatusRequest,
  updateTodo as updateTodoRequest,
} from '../../api/todoApi';
import type {AxiosError} from 'axios';

const TODOS_QUERY_KEY = ['todos'];

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
  const {accessToken, logout} = useAuth();
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: todos = [],
    isPending: isTodosPending,
    isFetching: isTodosFetching,
    error: todosError,
    refetch,
  } = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: fetchTodos,
    enabled: Boolean(accessToken),
    retry: 1,
  });

  const createTodoMutation = useMutation({
    mutationFn: createTodoRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: TODOS_QUERY_KEY});
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({id, payload}: {id: string; payload: CreateTodoPayload}) =>
      updateTodoRequest(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: TODOS_QUERY_KEY});
    },
  });

  const toggleTodoStatusMutation = useMutation({
    mutationFn: ({id, completed}: {id: string; completed: boolean}) =>
      toggleTodoStatusRequest(id, completed),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: TODOS_QUERY_KEY});
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodoRequest,
    onSuccess: async (_, id) => {
      setEditingTodoId((current) => (current === id ? null : current));
      await queryClient.invalidateQueries({queryKey: TODOS_QUERY_KEY});
    },
  });

  const isMutating =
    createTodoMutation.isPending ||
    updateTodoMutation.isPending ||
    toggleTodoStatusMutation.isPending ||
    deleteTodoMutation.isPending;

  const isLoading = isTodosPending || isTodosFetching || isMutating;

  useEffect(() => {
    if (!accessToken) {
      setIsCreatingTask(false);
      setEditingTodoId(null);
      setError(null);
      queryClient.removeQueries({queryKey: TODOS_QUERY_KEY});
    }
  }, [accessToken, queryClient]);

  useEffect(() => {
    if (todosError) {
      console.error('Failed to load todos', todosError);
      setError(t('todos.errors.fetchFailed'));
      const axiosError = todosError as AxiosError<{message?: string; error?: string}>;
      if (axiosError.response?.status === 401) {
        logout();
      }
    } else if (!isTodosFetching) {
      setError((current) => (current === t('todos.errors.fetchFailed') ? null : current));
    }
  }, [todosError, t, isTodosFetching, logout]);

  const openCreateTask = useCallback(() => {
    setIsCreatingTask(true);
  }, []);

  const closeCreateTask = useCallback(() => {
    setIsCreatingTask(false);
  }, []);

  const openEditTask = useCallback((todo: TodoSummary) => {
    setEditingTodoId(todo.id);
  }, []);

  const closeEditTask = useCallback(() => {
    setEditingTodoId(null);
  }, []);

  const createTodo = useCallback(
    async (payload: CreateTodoPayload) => {
      if (!accessToken) {
        return;
      }

      setError(null);
      try {
        await createTodoMutation.mutateAsync({
          title: payload.title,
          description: payload.description ?? '',
        });
        closeCreateTask();
        setError(null);
      } catch (err) {
        console.error('Failed to create task', err);
        setError(t('todos.errors.createFailed'));
        throw err;
      }
    },
    [accessToken, closeCreateTask, createTodoMutation, t]
  );

  const updateTodo = useCallback(
    async (id: string, payload: CreateTodoPayload) => {
      if (!accessToken) {
        return;
      }

      setError(null);
      try {
        await updateTodoMutation.mutateAsync({
          id,
          payload: {
            title: payload.title,
            description: payload.description ?? '',
          },
        });
        closeEditTask();
        setError(null);
      } catch (err) {
        console.error('Failed to update task', err);
        setError(t('todos.errors.updateFailed'));
        throw err;
      }
    },
    [accessToken, closeEditTask, t, updateTodoMutation]
  );

  const toggleTodoStatus = useCallback(
    async (todo: TodoSummary, completed: boolean) => {
      if (!accessToken) {
        return;
      }

      setError(null);
      try {
        await toggleTodoStatusMutation.mutateAsync({
          id: todo.id,
          completed,
        });
        setError(null);
      } catch (err) {
        console.error('Failed to update task status', err);
        setError(t('todos.errors.toggleFailed'));
      }
    },
    [accessToken, t, toggleTodoStatusMutation]
  );

  const deleteTodo = useCallback(
    async (todo: TodoSummary) => {
      if (!accessToken) {
        return;
      }

      setError(null);
      try {
        await deleteTodoMutation.mutateAsync(todo.id);
        setError(null);
      } catch (err) {
        console.error('Failed to delete task', err);
        setError(t('todos.errors.deleteFailed'));
      }
    },
    [accessToken, deleteTodoMutation, t]
  );

  const clearError = useCallback(() => setError(null), []);

  const editingTodo = useMemo(
    () => (editingTodoId ? todos.find((todo) => todo.id === editingTodoId) ?? null : null),
    [editingTodoId, todos]
  );

  const value = useMemo<TodoContextValue>(
    () => ({
      todos,
      isLoading,
      isCreatingTask,
      editingTodoId,
      editingTodo,
      openCreateTask,
      closeCreateTask,
      openEditTask,
      closeEditTask,
      createTodo,
      updateTodo,
      toggleTodoStatus,
      deleteTodo,
      refreshTodos: async () => {
        await refetch();
      },
      error,
      clearError,
    }),
    [
      todos,
      isLoading,
      isCreatingTask,
      editingTodoId,
      openCreateTask,
      closeCreateTask,
      openEditTask,
      closeEditTask,
      createTodo,
      updateTodo,
      toggleTodoStatus,
      deleteTodo,
      editingTodo,
      refetch,
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
