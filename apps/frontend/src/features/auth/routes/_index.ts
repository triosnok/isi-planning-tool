import { AuthStatus } from '@/lib/constants';
import { RouteDefinition } from '@/router';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
  {
    path: '/sign-in',
    component: lazy(() => import('./SignIn')),
    meta: {
      authentication: AuthStatus.SIGNED_OUT,
    }
  },
  {
    path: '/forgot-password',
    component: lazy(() => import('./ForgotPassword')),
    meta: {
      authentication: AuthStatus.SIGNED_OUT,
    }
  },
];
