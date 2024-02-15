import { Router } from '@solidjs/router';
import type { Component } from 'solid-js';
import { routes } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { I18nProvider } from './features/i18n';

const queryClient = new QueryClient();

const App: Component = () => {
  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <Router>{routes}</Router>
      </QueryClientProvider>
    </I18nProvider>
  );
};

export default App;
