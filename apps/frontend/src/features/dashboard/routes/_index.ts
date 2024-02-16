import { AuthStatus } from '@/lib/constants';
import { RouteDefinition } from '@/router';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(() => import('./Dashboard')),
    meta: {
      authentication: AuthStatus.SIGNED_IN,
    }
  },
];
