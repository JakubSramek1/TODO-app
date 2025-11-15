import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useAuth} from '../../auth/AuthContext';
import {TODO_LIST_QUERY_KEY} from '../../../api/todoApi';

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
      await queryClient.invalidateQueries({queryKey: [TODO_LIST_QUERY_KEY]});
    },
  });
};
