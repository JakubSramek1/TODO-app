import {Box, Heading, Image, Text} from '@chakra-ui/react';
import PlaceholderImage from '../../assets/Image1.svg';

const HomeEmptyState = () => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" gap={3}>
    <Image src={PlaceholderImage} alt="Empty state" loading="lazy" decoding="async" style={{objectFit: 'contain'}} />
    <Heading fontWeight="heading.1" fontSize="heading.2">
      You are amazing!
    </Heading>
    <Text fontSize="text.base" fontWeight="text.base" color="text-tertiary">
      There is no more task to do.
    </Text>
  </Box>
);

export default HomeEmptyState;
