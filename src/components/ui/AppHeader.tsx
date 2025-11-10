import {Box, Image, Text} from '@chakra-ui/react';
import {useTranslation} from 'react-i18next';
import logo from '../../assets/logo.svg';
import AppAvatar from './AppAvatar';
import {useAppSelector} from '../../hooks';

const AppHeader = () => {
  const {accessToken} = useAppSelector(({auth}) => auth);
  const showAvatar = Boolean(accessToken);
  const {t} = useTranslation();

  return (
    <Box
      bg="fill-gray-lightest"
      h="28"
      w="full"
      px={{base: 6, md: 12}}
      display="flex"
      alignItems="center"
      justifyContent={showAvatar ? 'space-between' : 'center'}
      gap={2}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Image
          src={logo}
          alt={t('app.logoAlt')}
          boxSize="8"
          maxW="8"
          maxH="8"
          loading="lazy"
          decoding="async"
          style={{objectFit: 'contain'}}
        />
        <Text fontSize="text.base" fontWeight="heading.2" color="fill-darkBlue">
          {t('app.brand')}
        </Text>
      </Box>
      {showAvatar ? <AppAvatar /> : null}
    </Box>
  );
};

export default AppHeader;
