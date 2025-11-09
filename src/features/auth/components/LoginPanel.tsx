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
import {yupResolver} from '@hookform/resolvers/yup';
import {useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import AuthErrorAlert from '../../../components/auth/AuthErrorAlert';
import FormField from '../../../components/form/FormField';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {ReactComponent as IconHide} from '../../../assets/icons/icon.hide.svg';
import {ReactComponent as IconShow} from '../../../assets/icons/icon-show.svg';
import {ReactComponent as IconForward} from '../../../assets/icons/icon-foward.svg';
import {loginUser} from '../authSlice';

const loginSchema = yup.object({
  username: yup.string().trim().required('Username is required'),
  password: yup.string().required('Password is required'),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

const LoginPanel = () => {
  const dispatch = useAppDispatch();
  const {status, error} = useAppSelector(({auth}) => auth);

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onChange',
  });

  const isLoading = status === 'loading' || isSubmitting;
  const hasError = !!error;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordAriaLabel = useMemo(
    () => (isPasswordVisible ? 'Hide password' : 'Show password'),
    [isPasswordVisible]
  );

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((previous) => !previous);
  };

  const onSubmit = async (values: LoginFormValues) => {
    await dispatch(loginUser(values));
  };

  return (
    <Box
      maxW="sm"
      mx="auto"
      p={8}
      borderWidth="1px"
      borderRadius="24px"
      bg="fill-white"
      minW="560px"
    >
      <Stack as="form" onSubmit={handleSubmit(onSubmit)} gap={10}>
        <Box spaceY={6}>
          <Heading fontSize="heading.1" fontWeight="heading.1" textAlign="center">
            It’s good to have you back!
          </Heading>
          <Text fontSize="text.base" fontWeight="text.base" color="text-secondary">
            Welcome to our secure portal! To access the full functionality of our app, kindly
            provide your credentials below. Your privacy is our priority.
          </Text>
        </Box>

        {hasError ? <AuthErrorAlert>{error}</AuthErrorAlert> : null}

        <Box spaceY={6}>
          <FormField label="Username" required error={errors.username?.message}>
            <Input {...register('username')} autoComplete="username" variant="outline" />
          </FormField>

          <FormField label="Password" required error={errors.password?.message}>
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
                {...register('password')}
                autoComplete="current-password"
                variant="outline"
              />
            </InputGroup>
          </FormField>
        </Box>

        <Box>
          <Button
            type="submit"
            w="full"
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
        </Box>
      </Stack>
    </Box>
  );
};

export default LoginPanel;
