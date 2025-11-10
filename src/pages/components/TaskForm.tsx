import {Box, Button, Heading, Icon, IconButton, Input, Stack, Textarea} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {ReactComponent as IconBack} from '../../assets/icons/icon-backwards.svg';
import {ReactComponent as IconCheck} from '../../assets/icons/icon-check.svg';
import FormField from '../../components/form/FormField';
import AppButton from '../../components/ui/AppButton';

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
  const {t} = useTranslation();

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
      gap={{base: 6, md: 10}}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={{base: 'justify-between', md: 'flex-start'}}
        gap={{base: 4, md: 6}}
      >
        <IconButton
          aria-label={t('taskForm.back')}
          onClick={handleCancel}
          size="md"
          type="button"
          rounded="full"
          bg="fill-gray"
          color="fill-darkBlue"
          alignSelf={{base: 'flex-start', md: 'center'}}
        >
          <IconBack />
        </IconButton>
        <Heading fontSize="heading.2" fontWeight="heading.1">
          {heading}
        </Heading>
      </Stack>

      <Stack gap={{base: 4, md: 6}}>
        <FormField label={t('taskForm.labels.name')} required error={errors.title?.message}>
          <Input
            {...register('title', {required: t('taskForm.validation.nameRequired')})}
            variant="outline"
            borderColor={errors.title ? 'border-danger' : undefined}
            required
          />
        </FormField>

        <FormField label={t('taskForm.labels.description')}>
          <Textarea
            {...register('description')}
            variant="outline"
            placeholder={t('taskForm.placeholders.description')}
            rows={4}
            resize="none"
          />
        </FormField>
      </Stack>

      <Stack
        direction={{base: 'column-reverse', md: 'row'}}
        justifyContent={{base: 'flex-start', md: 'space-between'}}
        alignItems={{base: 'stretch', md: 'center'}}
        gap={{base: 4, md: 6}}
      >
        <Button
          bg="fill-gray"
          color="text-secondary"
          borderRadius="full"
          onClick={handleCancel}
          type="button"
          w={{base: 'full', md: 'auto'}}
        >
          {cancelLabel}
        </Button>
        <AppButton type="submit" loading={isSubmitting} w={{base: 'full', md: 'auto'}}>
          {submitLabel}
          <Icon as={IconCheck} boxSize={4} />
        </AppButton>
      </Stack>
    </Box>
  );
};

export default TaskForm;
