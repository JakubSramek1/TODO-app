import {Field} from '@chakra-ui/react';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormField = ({label, required, children}: FormFieldProps) => {
  console.log('required', required);
  return (
    <Field.Root required={required}>
      {/* @ts-ignore chakra-ui/react is not typed correctly */}
      <Field.Label>
        <Field.RequiredIndicator color="text-danger" />
        {label}
      </Field.Label>

      {children}
    </Field.Root>
  );
};

export default FormField;
