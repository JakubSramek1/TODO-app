import {Alert} from '@chakra-ui/react';

type AuthErrorAlertProps = Alert.RootProps;

const AuthErrorAlert = ({children, ...props}: AuthErrorAlertProps) => (
  <Alert.Root status="error" {...props}>
    <Alert.Indicator />
    <Alert.Content>
      <Alert.Title>{children}</Alert.Title>
    </Alert.Content>
  </Alert.Root>
);

export default AuthErrorAlert;
