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
import {
  CREATE_TODO_QUERY_KEY,
  DELETE_TODO_QUERY_KEY,
  TODO_LIST_QUERY_KEY,
  TODO_QUERY_KEY,
  TOGGLE_TODO_STATUS_QUERY_KEY,
  UPDATE_TODO_QUERY_KEY,
} from '../../api/todoApi';

interface TodoContextValue {
  error: string | null;
  clearError: () => void;
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export const TodoProvider = ({children}: {children: ReactNode}) => {
  const {accessToken} = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setError(null);
      queryClient.removeQueries({
        queryKey: [
          TODO_LIST_QUERY_KEY,
          TODO_QUERY_KEY,
          CREATE_TODO_QUERY_KEY,
          UPDATE_TODO_QUERY_KEY,
          TOGGLE_TODO_STATUS_QUERY_KEY,
          DELETE_TODO_QUERY_KEY,
        ],
      });
    }
  }, [accessToken, queryClient]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<TodoContextValue>(
    () => ({
      error,
      clearError,
    }),
    [error, clearError]
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
