import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '../i18n';
import { ThemeProvider } from '@/components/theme-provider';
import Footer from '@/Footer/Footer';

import { OptionsPage } from './options';

const container = document.getElementById('root');
const root = createRoot(container as HTMLDivElement);

root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <OptionsPage />
      <Footer />
    </ThemeProvider>
  </StrictMode>,
);
