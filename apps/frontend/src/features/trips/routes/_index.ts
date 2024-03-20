import { AuthStatus } from '@/lib/constants';
import { RouteDefinition } from '@/router';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
  {
    path: '/projects/:projectId/trip/:tripId',
    component: lazy(() => import('./TripLayout')),
    children: [{ path: '/', component: lazy(() => import('./Trip')) }],
    meta: {
      authentication: {
        status: AuthStatus.SIGNED_IN,
      },
    },
  },
];
