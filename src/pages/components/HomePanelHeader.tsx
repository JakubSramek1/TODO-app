import {Box, Heading, Icon, Text} from '@chakra-ui/react';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ReactComponent as IconAdd} from '../../assets/icons/icon-add.svg';
import {useTodos} from '../../features/todos/TodoContext';
import AppButton from '../../components/ui/AppButton';
import {getFormattedCurrentDate} from '../../utils/date';
import {useAuth} from '../../features/auth/AuthContext';

const HomePanelHeader = () => {
  const {user} = useAuth();
  const {openCreateTask} = useTodos();
  const {t, i18n} = useTranslation();
  const username = user?.username ?? t('home.panel.defaultName');

  const formattedDate = useMemo(
    () => getFormattedCurrentDate({locale: i18n.language}),
    [i18n.language]
  );

  return (
    <Box
      display="flex"
      flexDirection={{base: 'column', md: 'row'}}
      justifyContent="space-between"
      alignItems="start"
      gap={{base: 4, md: 0}}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Heading fontWeight="heading.1" fontSize="heading.2">
          {t('home.panel.greeting', {name: username})}
        </Heading>
        <Text fontSize="text.base" fontWeight="text.base" color="text-tertiary">
          {t('home.panel.date', {date: formattedDate})}
        </Text>
      </Box>
      <AppButton
        css={{'& svg path': {fill: 'currentColor'}}}
        onClick={openCreateTask}
        display="inline-flex"
        alignItems="center"
        gap={2}
        w={{base: 'full', md: 'auto'}}
      >
        {t('common.buttons.addTask')}
        <Icon boxSize={4}>
          <IconAdd />
        </Icon>
      </AppButton>
    </Box>
  );
};

export default HomePanelHeader;
