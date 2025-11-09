import {Box, Button, Heading, Stack, Textarea, Input, IconButton, Icon} from '@chakra-ui/react';
import {ReactComponent as IconBack} from '../../assets/icons/icon-backwards.svg';
import {useForm} from 'react-hook-form';
import FormField from '../../components/form/FormField';
import {ReactComponent as IconCheck} from '../../assets/icons/icon-check.svg';
import apiClient from '../../api/apiClient';
import {useAppSelector} from '../../hooks';
import {useState} from 'react';

interface NewTaskFormProps {
  onClose: () => void;
}

type NewTaskFormValues = {
  title: string;
  description?: string;
};

const defaultValues: NewTaskFormValues = {
  title: '',
  description: '',
};

const NewTaskForm = ({onClose}: NewTaskFormProps) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<NewTaskFormValues>({
    defaultValues,
    mode: 'onBlur',
  });

  const handleDiscard = () => {
    reset();
    onClose();
  };

  const handleSubmitTask = async (values: NewTaskFormValues) => {
    setIsLoading(true);
    try {
      await apiClient.post(
        '/todo',
        {
          title: values.title,
          description: values.description ?? '',
        },
        accessToken ? {headers: {Authorization: `Bearer ${accessToken}`}} : undefined
      );
      onClose();
      reset(defaultValues);
    } catch (error) {
      console.error('Failed to create task', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleSubmitTask)}
      display="flex"
      flexDirection="column"
      gap={10}
    >
      <Stack direction="row" alignItems="center" gap={6}>
        <IconButton
          aria-label="Discard task"
          onClick={handleDiscard}
          size="md"
          type="button"
          rounded="full"
          bg="fill-gray"
        >
          <IconBack />
        </IconButton>
        <Heading fontSize="heading.2" fontWeight="heading.1">
          New task
        </Heading>
      </Stack>

      <Stack gap={6}>
        <FormField label="Task name" required error={errors.title?.message}>
          <Input
            {...register('title', {required: 'Task name is required'})}
            variant="outline"
            borderColor={errors.title ? 'border-danger' : undefined}
            required
          />
        </FormField>

        <FormField label="Description (Optional)">
          <Textarea
            {...register('description')}
            variant="outline"
            placeholder="Describe the task"
            rows={4}
            resize="none"
          />
        </FormField>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button
          bg="fill-gray"
          color="text-secondary"
          borderRadius="full"
          onClick={handleDiscard}
          type="button"
        >
          Discard
        </Button>
        <Button
          type="submit"
          bg="fill-brand"
          color="text-white"
          borderRadius="100px"
          _hover={{bg: 'fill-brand-hover'}}
          _active={{bg: 'fill-brand-hover'}}
          loading={isLoading}
          css={{'& svg path': {fill: 'currentColor'}}}
        >
          Create task
          <Icon as={IconCheck} boxSize={4} />
        </Button>
      </Stack>
    </Box>
  );
};

export default NewTaskForm;
