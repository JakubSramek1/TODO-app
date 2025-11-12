import {Avatar, Box, Text} from '@chakra-ui/react';
import {useAuth} from '../../features/auth/AuthContext';

const AppAvatar = () => {
  const {user} = useAuth();

  if (!user) {
    return null;
  }

  const username = user?.username ?? 'Unknown User';

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar.Root size="sm" colorPalette="blue">
        <Avatar.Fallback name={username} />
        {/* @ts-ignore chakra-ui/react/avatar has incorrect type for Image */}
        <Avatar.Image src="https://bit.ly/sage-adebayo" alt={username} />
      </Avatar.Root>
      <Text fontSize="text.base" fontWeight="text.base">
        {username}
      </Text>
    </Box>
  );
};

export default AppAvatar;
