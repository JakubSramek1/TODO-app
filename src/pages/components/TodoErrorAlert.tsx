import {Alert, Button} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';

interface TodoErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

const TodoErrorAlert = ({message, onDismiss}: TodoErrorAlertProps) => {
  const {t} = useTranslation();

  return (
    <Alert.Root
      status="error"
      borderRadius="lg"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={4}
    >
      <Alert.Indicator />
      <Alert.Content
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
      >
        <Alert.Title minW={0}>{message}</Alert.Title>
        <Button variant="subtle" size="sm" onClick={onDismiss}>
          {t('common.buttons.dismiss')}
        </Button>
      </Alert.Content>
    </Alert.Root>
  );
};

export default TodoErrorAlert;


