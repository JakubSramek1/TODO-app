import {Box, BoxProps} from '@chakra-ui/react';

const CardWrapper = ({children, ...rest}: BoxProps) => (
  <Box
    display="flex"
    flexDirection="column"
    borderRadius="24px"
    bg="fill-white"
    p={10}
    {...rest}
  >
    {children}
  </Box>
);

export default CardWrapper;
