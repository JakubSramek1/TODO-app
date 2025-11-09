import {Field} from '@chakra-ui/react';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormField = ({label, required, children}: FormFieldProps) => {
  return (
    <Field.Root required={required}>
      <Field.Label>
        <Field.RequiredIndicator color="text-danger" />
        {label}
      </Field.Label>

      {children}
    </Field.Root>
  );
};

export default FormField;
