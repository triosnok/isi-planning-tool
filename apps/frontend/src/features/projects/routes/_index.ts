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
      { path: '/:id/update', component: lazy(() => import('./UpdateProject')) },
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
        ],
      },
      {
        path: '/:id/railings/:railingId',
        component: lazy(() => import('./RailingDetails')),
      },
    ],
    meta: {
      authentication: {
        status: AuthStatus.SIGNED_IN,
      },
    },
  },
];
