import {Box, Heading, Image, Text} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import PlaceholderImage from '../../assets/Image1.svg';
import {useTodos} from '../../features/todos/TodoContext';
import AppButton from '../../components/ui/AppButton';

const HomeEmptyState = () => {
  const {openCreateTask, todos} = useTodos();
  const {t} = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      gap={3}
    >
      <Image
        src={PlaceholderImage}
        alt={t('home.empty.imageAlt')}
        loading="lazy"
        decoding="async"
        style={{objectFit: 'contain'}}
      />
      <Heading fontWeight="heading.1" fontSize="heading.2">
        {t('home.empty.title')}
      </Heading>
      <Text fontSize="text.base" fontWeight="text.base" color="text-tertiary">
        {t('home.empty.description')}
      </Text>
      {!todos.length ? (
        <AppButton onClick={openCreateTask}>{t('common.buttons.createFirstTask')}</AppButton>
      ) : null}
    </Box>
  );
};

export default HomeEmptyState;
