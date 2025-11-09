import {Box} from '@chakra-ui/react';
import {Helmet} from 'react-helmet-async';
import {useTranslation} from 'react-i18next';
import {Navigate, Route, Routes} from 'react-router-dom';
import Login from './features/auth/Login';
import ProtectedRoute from './router/ProtectedRoute';
import Home from './pages/Home';

function App() {
  const {i18n, t} = useTranslation();

  return (
    <Box bg="fill-gray-lightest" h="100vh" w="100vw">
      <Helmet
        titleTemplate={`%s - ${t('app.title')}`}
        defaultTitle={t('app.title')}
        htmlAttributes={{lang: i18n.language}}
      >
        <meta name="description" content={t('app.description')} />
      </Helmet>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
}

export default App;
