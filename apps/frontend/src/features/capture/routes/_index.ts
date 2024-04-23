import { AuthStatus } from '@/lib/constants';
import { RouteDefinition } from '@/router';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
  {
    path: '/capture',
    component: lazy(() => import('./Capture')),
    meta: {
      authentication: {
        status: AuthStatus.SIGNED_IN,
      },
    },
  },
];
