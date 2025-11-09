import {Box, Button, Heading, Icon, IconButton, Input, Stack, Textarea} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {ReactComponent as IconBack} from '../../assets/icons/icon-backwards.svg';
import {ReactComponent as IconCheck} from '../../assets/icons/icon-check.svg';
import FormField from '../../components/form/FormField';

export interface TaskFormValues {
  title: string;
  description?: string;
}

export interface TaskFormProps {
  heading: string;
  submitLabel: string;
  cancelLabel: string;
  initialValues: TaskFormValues;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
}

const TaskForm = ({
  heading,
  submitLabel,
  cancelLabel,
  initialValues,
  onSubmit,
  onCancel,
}: TaskFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<TaskFormValues>({
    defaultValues: initialValues,
    mode: 'onBlur',
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleCancel = () => {
    reset(initialValues);
    onCancel();
  };

  const handleFormSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      reset(initialValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      display="flex"
      flexDirection="column"
      gap={10}
    >
      <Stack direction="row" alignItems="center" gap={6}>
        <IconButton
          aria-label="Back to home"
          onClick={handleCancel}
          size="md"
          type="button"
          rounded="full"
          bg="fill-gray"
        >
          <IconBack />
        </IconButton>
        <Heading fontSize="heading.2" fontWeight="heading.1">
          {heading}
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
          onClick={handleCancel}
          type="button"
        >
          {cancelLabel}
        </Button>
        <Button
          type="submit"
          bg="fill-brand"
          color="text-white"
          borderRadius="100px"
          _hover={{bg: 'fill-brand-hover'}}
          _active={{bg: 'fill-brand-hover'}}
          loading={isSubmitting}
          css={{'& svg path': {fill: 'currentColor'}}}
        >
          {submitLabel}
          <Icon as={IconCheck} boxSize={4} />
        </Button>
      </Stack>
    </Box>
  );
};

export default TaskForm;
