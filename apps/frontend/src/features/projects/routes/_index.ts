import { AuthStatus } from '@/lib/constants';
import { RouteDefinition } from '@/router';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
  {
    path: '/projects',
    component: lazy(() => import('./Projects')),
    meta: {
      // authentication: {
      //   status: AuthStatus.SIGNED_IN,
      // },
    },
  },
];
