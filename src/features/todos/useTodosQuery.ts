import {useQuery, type QueryFunction} from '@tanstack/react-query';
import {useAuth} from '../auth/AuthContext';

export const useTodosQuery = <TData = unknown>(
  queryFn: QueryFunction<TData, string[]>,
  queryKey: string[]
) => {
  const {accessToken} = useAuth();

  return useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(accessToken),
    retry: 1,
  });
};
