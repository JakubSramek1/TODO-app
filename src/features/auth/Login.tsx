import {Alert, Box, Button, Heading, Input, Stack, Text} from '@chakra-ui/react';
import {FormEvent, useCallback, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {loginUser} from './authSlice';

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

        {hasError ? (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{error}</Alert.Title>
            </Alert.Content>
          </Alert.Root>
        ) : null}

        <label>Username</label>
        <Input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
        />

        <label>Password</label>
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />

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
