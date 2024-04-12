import { Router } from '@solidjs/router';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import {
  PersistQueryClientOptions,
  PersistQueryClientProvider,
} from '@tanstack/solid-query-persist-client';
import type { Component } from 'solid-js';
import { CacheKey } from './api';
import { I18nProvider } from './features/i18n';
import { ThemeProvider } from './features/theme';
import { VehicleProvider } from './features/vehicles/context';
import { routes } from './router';

const queryClient = new QueryClient();
const PERSIST_OPTIONS: Omit<PersistQueryClientOptions, 'queryClient'> = {
  persister: createSyncStoragePersister({
    storage: localStorage,
    key: 'OFFLINE_CACHE',
  }),
  maxAge: 1000 * 60 * 60 * 24 * 7,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      return (
        query.state.status === 'success' &&
        query.queryKey.includes(CacheKey.USER_PROFILE)
      );
    },
  },
};

const App: Component = () => {
  return (
    <I18nProvider>
      <VehicleProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={PERSIST_OPTIONS}
            >
              <Router>{routes}</Router>
            </PersistQueryClientProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </VehicleProvider>
    </I18nProvider>
  );
};

export default App;
