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
    ],
    meta: {
      authentication: {
        status: AuthStatus.SIGNED_IN,
      },
    },
  },
];
