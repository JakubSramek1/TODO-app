import {Box, Button, Heading, Input, Stack, Text} from '@chakra-ui/react';
import {FormEvent, useCallback, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {registerUser} from './authSlice';
import AuthErrorAlert from '../../components/auth/AuthErrorAlert';
import FormField from '../../components/form/FormField';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {accessToken, status, error} = useAppSelector((state) => state.auth);

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
      await dispatch(registerUser({username, password}));
    },
    [dispatch, password, username]
  );

  return (
    <Box maxW="sm" mx="auto" mt={16} p={8} borderWidth="1px" borderRadius="lg">
      <Stack as="form" onSubmit={handleSubmit}>
        <Heading size="lg" textAlign="center">
          Register
        </Heading>

        {hasError ? <AuthErrorAlert>{error}</AuthErrorAlert> : null}

        <FormField label="Username" required>
          <Input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            variant="outline"
          />
        </FormField>

        <FormField label="Password" required>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            variant="outline"
          />
        </FormField>
        <Button type="submit" colorScheme="blue" loading={isLoading}>
          Create Account
        </Button>

        <Text textAlign="center">
          Already have an account?{' '}
          <Link to="/login" color="blue.500">
            Login
          </Link>
        </Text>
      </Stack>
    </Box>
  );
};

export default Register;
