import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useAuth} from '../auth/AuthContext';
import {useQueryClient} from '@tanstack/react-query';

export const TODOS_QUERY_KEY = ['todos'];

interface TodoContextValue {
  setEditingTodoId: (todoId: string | null) => void;
  error: string | null;
  clearError: () => void;
  editingTodoId: string | null;
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export const TodoProvider = ({children}: {children: ReactNode}) => {
  const {accessToken} = useAuth();
  const queryClient = useQueryClient();
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setEditingTodoId(null);
      setError(null);
      queryClient.removeQueries({queryKey: TODOS_QUERY_KEY});
    }
  }, [accessToken, queryClient]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<TodoContextValue>(
    () => ({
      editingTodoId,
      error,
      clearError,
      setEditingTodoId,
    }),
    [editingTodoId, error, clearError, setEditingTodoId]
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
