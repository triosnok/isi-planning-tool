import { AuthStatus } from '@/lib/constants';
import { RouteDefinition } from '@/router';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
  {
    path: '/projects',
    component: lazy(() => import('./ProjectsLayout')),
    children: [
      { path: '/', component: lazy(() => import('./Projects')) },
      { path: '/new', component: lazy(() => import('./NewProject')) },
      {
        path: '/:id',
        component: lazy(() => import('./Project')),
        children: [
          {
            path: '/',
          },
          {
            path: '/plans/new',
            component: lazy(() => import('./NewProjectPlan')),
          },
          {
            path: '/plans/:planId',
            component: lazy(() => import('./EditProjectPlan')),
          },
        ],
      },
    ],
    meta: {
      authentication: {
        status: AuthStatus.SIGNED_IN,
      },
    },
  },
  {
    path: '/projects/trip',
    component: lazy(() => import('./TripLayout')),
    children: [{ path: '/', component: lazy(() => import('./Trip')) }],
    meta: {
      authentication: {
        status: AuthStatus.SIGNED_IN,
      },
    },
  },
];
