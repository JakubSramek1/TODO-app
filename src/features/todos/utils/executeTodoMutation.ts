import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useAuth} from '../../auth/AuthContext';
import {TODOS_QUERY_KEY} from '../TodoContext';

export const useTodoMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  onSuccess?: () => void
) => {
  const {accessToken} = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      if (!accessToken) throw new Error('No access token');
      const result = await mutationFn(variables);
      return result;
    },
    onSuccess: async () => {
      onSuccess?.();
      await queryClient.invalidateQueries({queryKey: TODOS_QUERY_KEY});
    },
  });
};
