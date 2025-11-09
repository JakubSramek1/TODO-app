import {
  Box,
  Button,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import {ChangeEvent, FormEvent, useCallback, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {loginUser} from './authSlice';
import AuthErrorAlert from '../../components/auth/AuthErrorAlert';
import FormField from '../../components/form/FormField';
import {ReactComponent as IconShow} from '../../assets/icons/icon-show.svg';
import {ReactComponent as IconHide} from '../../assets/icons/icon.hide.svg';
import {ReactComponent as IconForward} from '../../assets/icons/icon-foward.svg';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {accessToken, status, error} = useAppSelector(({auth}) => auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isLoading = status === 'loading';
  const hasError = !!error;

  const passwordAriaLabel = isPasswordVisible ? 'Hide password' : 'Show password';

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

  const handleUsernameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }, []);

  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((previous) => !previous);
  }, []);

  return (
    <Box
      maxW="sm"
      mx="auto"
      mt={16}
      p={8}
      borderWidth="1px"
      borderRadius="lg"
      bg="fill-white"
      minW="560px"
    >
      <Stack as="form" onSubmit={handleSubmit} gap={6}>
        <Heading fontSize="heading.1" fontWeight="heading.1" textAlign="center">
          It’s good to have you back!
        </Heading>
        <Text fontSize="text.base" fontWeight="text.base" color="text-secondary">
          Welcome to our secure portal! To access the full functionality of our app, kindly provide
          your credentials below. Your privacy is our priority.
        </Text>

        {hasError ? <AuthErrorAlert>{error}</AuthErrorAlert> : null}

        <FormField label="Username" required>
          <Input
            value={username}
            onChange={handleUsernameChange}
            autoComplete="username"
            variant="outline"
          />
        </FormField>

        <FormField label="Password" required>
          <InputGroup
            endElement={
              <IconButton
                aria-label={passwordAriaLabel}
                onClick={togglePasswordVisibility}
                variant="ghost"
                size="sm"
                type="button"
                rounded="full"
              >
                {isPasswordVisible ? <IconHide /> : <IconShow />}
              </IconButton>
            }
            endOffset="2.75rem"
          >
            <Input
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              variant="outline"
            />
          </InputGroup>
        </FormField>

        <Button
          type="submit"
          loading={isLoading}
          bg="fill-brand"
          color="text-white"
          borderRadius="100px"
          _hover={{bg: 'fill-brand-hover'}}
          _active={{bg: 'fill-brand-hover'}}
          css={{'& svg path': {fill: 'currentColor'}}}
        >
          Login
          <Icon size="sm">
            <IconForward />
          </Icon>
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
