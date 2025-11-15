import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import type {TodoSummary} from './types';
import {useAuth} from '../auth/AuthContext';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toggleTodoStatus as toggleTodoStatusRequest} from '../../api/todoApi';

export const TODOS_QUERY_KEY = ['todos'];

interface TodoContextValue {
  isLoading: boolean;
  isCreatingTask: boolean;
  openCreateTask: () => void;
  closeCreateTask: () => void;
  openEditTask: (todo: string) => void;
  closeEditTask: () => void;
  toggleTodoStatus: (todo: TodoSummary, completed: boolean) => Promise<void>;
  error: string | null;
  clearError: () => void;
  editingTodoId: string | null;
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export const TodoProvider = ({children}: {children: ReactNode}) => {
  const {accessToken} = useAuth();
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleTodoStatusMutation = useMutation({
    mutationFn: ({id, completed}: {id: string; completed: boolean}) =>
      toggleTodoStatusRequest(id, completed),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: TODOS_QUERY_KEY});
    },
  });

  const isMutating = toggleTodoStatusMutation.isPending;

  const isLoading = isMutating;

  useEffect(() => {
    if (!accessToken) {
      setIsCreatingTask(false);
      setEditingTodoId(null);
      setError(null);
      queryClient.removeQueries({queryKey: TODOS_QUERY_KEY});
    }
  }, [accessToken, queryClient]);

  // useEffect(() => {
  //   if (todosError) {
  //     console.error('Failed to load todos', todosError);
  //     setError(t('todos.errors.fetchFailed'));
  //     const axiosError = todosError as AxiosError<{message?: string; error?: string}>;
  //     if (axiosError.response?.status === 401) {
  //       logout();
  //     }
  //   } else if (!isTodosFetching) {
  //     setError((current) => (current === t('todos.errors.fetchFailed') ? null : current));
  //   }
  // }, [todosError, t, isTodosFetching, logout]);

  const openCreateTask = useCallback(() => {
    setIsCreatingTask(true);
  }, []);

  const closeCreateTask = useCallback(() => {
    setIsCreatingTask(false);
  }, []);

  const openEditTask = useCallback((todoId: string) => {
    setEditingTodoId(todoId);
  }, []);

  const closeEditTask = useCallback(() => {
    setEditingTodoId(null);
  }, []);

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

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<TodoContextValue>(
    () => ({
      isLoading,
      isCreatingTask,
      editingTodoId,
      openCreateTask,
      closeCreateTask,
      openEditTask,
      closeEditTask,
      toggleTodoStatus,
      error,
      clearError,
    }),
    [
      isLoading,
      isCreatingTask,
      editingTodoId,
      openCreateTask,
      closeCreateTask,
      openEditTask,
      closeEditTask,
      toggleTodoStatus,
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
