import { Router } from '@solidjs/router';
import type { Component } from 'solid-js';
import { routes } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';

const queryClient = new QueryClient();

const App: Component = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>{routes}</Router>
    </QueryClientProvider>
  );
};

export default App;
