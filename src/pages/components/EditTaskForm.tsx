import {Box, Button, Heading, IconButton, Icon, Stack, Textarea, Input} from '@chakra-ui/react';
import {ReactComponent as IconBack} from '../../assets/icons/icon-backwards.svg';
import {ReactComponent as IconCheck} from '../../assets/icons/icon-check.svg';
import {useForm} from 'react-hook-form';
import FormField from '../../components/form/FormField';
import type {TodoSummary} from '../../features/todos/types';
import {useTodos} from '../../features/todos/TodoContext';
import {useEffect, useState} from 'react';

interface EditTaskFormProps {
  todo: TodoSummary;
  onClose: () => void;
}

type EditTaskFormValues = {
  title: string;
  description?: string;
};

const EditTaskForm = ({todo, onClose}: EditTaskFormProps) => {
  const {updateTodo} = useTodos();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<EditTaskFormValues>({
    defaultValues: {
      title: todo.title,
      description: todo.description,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    reset({title: todo.title, description: todo.description});
  }, [reset, todo.description, todo.title]);

  const handleDiscard = () => {
    reset();
    onClose();
  };

  const handleSubmitTask = async (values: EditTaskFormValues) => {
    setIsLoading(true);
    try {
      await updateTodo(todo.id, values);
      onClose();
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
          aria-label="Close edit"
          onClick={handleDiscard}
          size="md"
          type="button"
          rounded="full"
          bg="fill-gray"
        >
          <IconBack />
        </IconButton>
        <Heading fontSize="heading.2" fontWeight="heading.1">
          Edit task
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
          Cancel
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
          Save changes
          <Icon boxSize={4}>
            <IconCheck />
          </Icon>
        </Button>
      </Stack>
    </Box>
  );
};

export default EditTaskForm;
