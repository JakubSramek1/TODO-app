import {IconButton} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import {ReactComponent as IconCheck} from '../../assets/icons/icon-check.svg';

interface TodoStatusCheckboxProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

const TodoStatusCheckbox = ({checked, label, onChange}: TodoStatusCheckboxProps) => {
  const {t} = useTranslation();
  const ariaLabel = checked
    ? t('todos.status.markIncomplete', {label})
    : t('todos.status.markComplete', {label});

  return (
    <IconButton
      aria-label={ariaLabel}
      rounded="full"
      minW="8"
      h="8"
      bg={checked ? 'fill-brand' : 'fill-white'}
      borderWidth="2px"
      borderColor={checked ? 'fill-brand' : 'border-gray'}
      onClick={() => onChange(!checked)}
      _hover={{
        bg: !checked ? 'fill-gray' : undefined,
        borderColor: !checked ? 'border-brand' : undefined,
        boxShadow: '0 0 0 2px rgba(15, 98, 254, 0.3)',
      }}
      _focusVisible={{
        boxShadow: '0 0 0 2px rgba(15, 98, 254, 0.3)',
      }}
      _active={{
        bg: checked ? 'fill-brand-hover' : 'fill-gray',
        boxShadow: '0 0 0 2px rgba(15, 98, 254, 0.3)',
      }}
      css={{'& svg path': {fill: checked ? 'currentColor' : 'fill-brand'}}}
    >
      {checked ? <IconCheck /> : null}
    </IconButton>
  );
};

export default TodoStatusCheckbox;
