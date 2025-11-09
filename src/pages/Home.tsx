import {Box, Button, Heading, Stack, Text} from '@chakra-ui/react';
import {logout} from '../features/auth/authSlice';
import {useAppDispatch, useAppSelector} from '../hooks';

const Home = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector((state) => state.auth.user?.username ?? 'there');

  const handleLogout = () => {
    void dispatch(logout());
  };

  return (
    <Box maxW="xl" mx="auto" p={8} borderWidth="1px" borderRadius="lg">
      <Stack align="center">
        <Heading size="lg">Welcome, {username}!</Heading>
        <Text>You are viewing a protected page. Only authenticated users can see this.</Text>
        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </Stack>
    </Box>
  );
};

export default Home;
