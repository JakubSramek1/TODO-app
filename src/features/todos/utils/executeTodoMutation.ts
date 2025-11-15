import {useQueryClient} from '@tanstack/react-query';
import {useAuth} from '../../auth/AuthContext';
import {TODOS_QUERY_KEY} from '../TodoContext';

export const useTodoMutation = async <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  variables: TVariables,
  onSuccess?: () => void
): Promise<TData | void> => {
  const {accessToken} = useAuth();
  const queryClient = useQueryClient();

  if (!accessToken) {
    return;
  }

  try {
    const result = await mutationFn(variables);
    onSuccess?.();
    await queryClient.invalidateQueries({queryKey: TODOS_QUERY_KEY});
    return result;
  } catch (err) {
    throw err;
  }
};
