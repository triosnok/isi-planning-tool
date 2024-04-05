import { AuthStatus } from '@/lib/constants';
import { RouteDefinition } from '@/router';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
  {
    path: '/users',
    component: lazy(() => import('./UserOverview')),
    meta: {
      authentication: {
        status: AuthStatus.SIGNED_IN,
      },
    },
    children: [
      {
        path: '/',
      },
      {
        path: '/new',
        component: lazy(() => import('./AddUser')),
        meta: {
          authentication: {
            status: AuthStatus.SIGNED_IN,
            roles: ['PLANNER'],
          },
        },
      },
    ],
  },
  {
    path: '/users/:id',
    component: lazy(() => import('./UserDetails')),
    meta: {
      authentication: {
        status: AuthStatus.SIGNED_IN,
      },
    },
  },
];
