import {Box, Heading, Icon, Text} from '@chakra-ui/react';
import {ReactComponent as IconAdd} from '../../assets/icons/icon-add.svg';
import {useAppSelector} from '../../hooks';
import {useTodos} from '../../features/todos/TodoContext';
import AppButton from '../../components/ui/AppButton';

const HomePanelHeader = () => {
  const username = useAppSelector((state) => state.auth.user?.username ?? 'there');
  const {openCreateTask} = useTodos();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="start">
      <Box>
        <Heading fontWeight="heading.1" fontSize="heading.2">
          Hello, {username}!
        </Heading>
        <Text fontSize="text.base" fontWeight="text.base" color="text-tertiary">
          20. listopadu 2023
        </Text>
      </Box>
      <AppButton
        css={{'& svg path': {fill: 'currentColor'}}}
        onClick={openCreateTask}
        display="inline-flex"
        alignItems="center"
        gap={2}
      >
        Add Task
        <Icon boxSize={4}>
          <IconAdd />
        </Icon>
      </AppButton>
    </Box>
  );
};

export default HomePanelHeader;
