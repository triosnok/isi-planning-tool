import { AuthStatus } from '@/lib/constants';
import { RouteDefinition } from '@/router';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
  {
    path: '/vehicles',
    component: lazy(() => import('./VehicleOverview')),
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
        component: lazy(() => import('./AddVehicle')),
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
    path: '/vehicles/:id',
    component: lazy(() => import('./VehicleDetails')),
    meta: {
      authentication: {
        status: AuthStatus.SIGNED_IN,
      },
    },
  },
];
