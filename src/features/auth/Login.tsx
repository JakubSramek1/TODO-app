import {Box, Button, Heading, Input, Stack, Text} from '@chakra-ui/react';
import {FormEvent, useCallback, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {loginUser} from './authSlice';
import AuthErrorAlert from '../../components/auth/AuthErrorAlert';
import FormField from '../../components/form/FormField';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {accessToken, status, error} = useAppSelector(({auth}) => auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = status === 'loading';
  const hasError = !!error;

  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!username || !password) {
        return;
      }
      await dispatch(loginUser({username, password}));
    },
    [dispatch, password, username]
  );

  return (
    <Box maxW="sm" mx="auto" mt={16} p={8} borderWidth="1px" borderRadius="lg">
      <Stack as="form" onSubmit={handleSubmit}>
        <Heading size="lg" textAlign="center">
          Sign In
        </Heading>

        {hasError ? <AuthErrorAlert>{error}</AuthErrorAlert> : null}

        <FormField label="Username" required>
          <Input
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(event.target.value)
            }
            autoComplete="username"
            variant="outline"
          />
        </FormField>

        <FormField label="Password" required>
          <Input
            type="password"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
            autoComplete="current-password"
            variant="outline"
          />
        </FormField>

        <Button type="submit" colorScheme="blue" loading={isLoading}>
          Login
        </Button>

        <Text textAlign="center">
          Need an account?{' '}
          <Link to="/register" color="blue.500">
            Register
          </Link>
        </Text>
      </Stack>
    </Box>
  );
};

export default Login;
