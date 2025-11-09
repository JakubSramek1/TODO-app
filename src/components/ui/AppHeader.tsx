import {Box, Image, Text} from '@chakra-ui/react';
import logo from '../../assets/logo.svg';
import AppAvatar from './AppAvatar';
import {useAppSelector} from '../../hooks';

const AppHeader = () => {
  const {accessToken} = useAppSelector(({auth}) => auth);
  const showAvatar = Boolean(accessToken);

  return (
    <Box
      bg="fill-gray-lightest"
      h="112px"
      w="full"
      px={12}
      display="flex"
      alignItems="center"
      justifyContent={showAvatar ? 'space-between' : 'center'}
      gap={2}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Image
          src={logo}
          alt="Zentask logo"
          boxSize="32px"
          maxW="32px"
          maxH="32px"
          loading="lazy"
          decoding="async"
          style={{objectFit: 'contain'}}
        />
        <Text fontSize="text.base" fontWeight="heading.2" color="fill-darkBlue">
          Zentask
        </Text>
      </Box>
      {showAvatar ? <AppAvatar /> : null}
    </Box>
  );
};

export default AppHeader;
