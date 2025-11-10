import {Field} from '@chakra-ui/react';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

const FormField = ({label, required, error, children}: FormFieldProps) => (
  <Field.Root required={required} invalid={Boolean(error)}>
    {/* @ts-ignore - Field.Label is not typed correctly */}
    <Field.Label fontWeight="text.base" color="text-secondary">
      <Field.RequiredIndicator color="text-danger" />
      {label}
    </Field.Label>
    {children}
    {/* @ts-ignore - Field.ErrorText is not typed correctly */}
    {error ? <Field.ErrorText color="text-danger">{error}</Field.ErrorText> : null}
  </Field.Root>
);

export default FormField;
