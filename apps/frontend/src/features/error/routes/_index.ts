import { RouteDefinition } from '@/router';
import { lazy } from 'solid-js';

export const routes: RouteDefinition[] = [
  {
    path: '/forbidden',
    component: lazy(() => import('./Forbidden')),
  },
  {
    path: '*404',
    component: lazy(() => import('./NotFound')),
  },
];
