import {Box, Button, Heading, Icon, Text} from '@chakra-ui/react';
import {ReactComponent as IconAdd} from '../../assets/icons/icon-add.svg';
import {useAppSelector} from '../../hooks';

interface HomePanelHeaderProps {
  onAddTask: () => void;
}

const HomePanelHeader = ({onAddTask}: HomePanelHeaderProps) => {
  const username = useAppSelector((state) => state.auth.user?.username ?? 'there');

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
      <Button
        bg="fill-brand"
        color="text-white"
        borderRadius="100px"
        _hover={{bg: 'fill-brand-hover'}}
        _active={{bg: 'fill-brand-hover'}}
        css={{'& svg path': {fill: 'currentColor'}}}
        onClick={onAddTask}
        display="inline-flex"
        alignItems="center"
        gap={2}
      >
        Add Task
        <Icon as={IconAdd} boxSize={4} />
      </Button>
    </Box>
  );
};

export default HomePanelHeader;
