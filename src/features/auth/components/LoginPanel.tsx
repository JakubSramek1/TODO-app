import {Box, Heading, Icon, IconButton, Input, InputGroup, Stack, Text} from '@chakra-ui/react';
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
import AppButton from '../../../components/ui/AppButton';
import {useTranslation} from 'react-i18next';

type LoginFormValues = {
  username: string;
  password: string;
};

const defaultValues: LoginFormValues = {
  username: '',
  password: '',
};

const LoginPanel = () => {
  const dispatch = useAppDispatch();
  const {status, error} = useAppSelector(({auth}) => auth);
  const {t} = useTranslation();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validationSchema = useMemo(
    () =>
      yup.object({
        username: yup.string().trim().required(t('auth.login.validation.usernameRequired')),
        password: yup.string().required(t('auth.login.validation.passwordRequired')),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<LoginFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'onChange',
  });

  const isLoading = status === 'loading' || isSubmitting;
  const hasError = !!error;
  const passwordAriaLabel = isPasswordVisible
    ? t('auth.login.password.hide')
    : t('auth.login.password.show');

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((previous) => !previous);
  };

  const onSubmit = async (values: LoginFormValues) => {
    await dispatch(loginUser(values));
  };

  return (
    <Box
      maxW="28rem"
      mx={{base: 2, md: 'auto'}}
      p={{base: 6, md: 8}}
      borderWidth="1px"
      borderRadius="3xl"
      bg="fill-white"
    >
      <Stack as="form" onSubmit={handleSubmit(onSubmit)} gap={{base: 6, md: 10}}>
        <Stack gap={{base: 4, md: 6}} textAlign="center">
          <Heading fontSize={{base: 'heading.2', md: 'heading.1'}} fontWeight="heading.1">
            {t('auth.login.heading')}
          </Heading>
          <Text fontSize="text.base" fontWeight="text.base" color="text-secondary">
            {t('auth.login.description')}
          </Text>
        </Stack>

        {hasError ? <AuthErrorAlert>{error}</AuthErrorAlert> : null}

        <Stack gap={{base: 4, md: 6}}>
          <FormField
            label={t('auth.login.fields.username')}
            required
            error={errors.username?.message}
          >
            <Input {...register('username')} autoComplete="username" variant="outline" />
          </FormField>

          <FormField
            label={t('auth.login.fields.password')}
            required
            error={errors.password?.message}
          >
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
        </Stack>

        <Box>
          <AppButton type="submit" w="full" loading={isLoading}>
            {t('auth.login.submit')}
            <Icon as={IconForward} boxSize={4} ml={2} />
          </AppButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default LoginPanel;
