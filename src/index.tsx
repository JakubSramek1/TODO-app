import {ChakraProvider} from '@chakra-ui/react';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import {QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import WebVitals from './WebVitals';
import './i18n/i18n';
import theme from './theme';
import {queryClient} from './app/queryClient';
import {AuthProvider} from './features/auth/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={theme}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <App />
              <WebVitals showStatusInConsoleLog />
            </BrowserRouter>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ChakraProvider>
  </StrictMode>
);
