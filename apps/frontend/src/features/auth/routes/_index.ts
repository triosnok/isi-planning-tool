import { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
  {
    path: '/sign-in',
    component: lazy(() => import('./SignIn')),
  },
  {
    path: '/forgot-password',
    component: lazy(() => import('./ForgotPassword')),
  },
];
