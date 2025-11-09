import {Box, Image, Text} from '@chakra-ui/react';
import logo from '../../../assets/logo.svg';

const LoginHeader = () => (
  <Box
    bg="fill-gray-lightest"
    h="112px"
    w="full"
    display="flex"
    justifyContent="center"
    alignItems="center"
    gap={2}
  >
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
);

export default LoginHeader;
