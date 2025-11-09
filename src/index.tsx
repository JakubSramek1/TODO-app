import {ChakraProvider} from '@chakra-ui/react';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import WebVitals from './WebVitals';
import './i18n/i18n';
import {store} from './app/store';
import theme from './theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={theme}>
      <HelmetProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
            <WebVitals showStatusInConsoleLog />
          </BrowserRouter>
        </Provider>
      </HelmetProvider>
    </ChakraProvider>
  </StrictMode>
);
