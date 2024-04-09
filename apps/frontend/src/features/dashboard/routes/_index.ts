import { AuthStatus } from '@/lib/constants';
import { RouteDefinition } from '@/router';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
  {
    path: '/dashboard',
    component: lazy(() => import('./Dashboard')),
    meta: {
      authentication: {
        status: AuthStatus.SIGNED_IN,
      },
    },
  },
];
