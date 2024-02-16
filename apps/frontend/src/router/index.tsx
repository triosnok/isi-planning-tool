import type { RouteDefinition as SolidRouteDef } from '@solidjs/router';
import { JSX } from 'solid-js';
import { AuthStatus, Role } from '../lib/constants';
import RouteGuard from './RouteGuard';

export interface RouteMeta {
  authentication?: AuthStatus;
  /**
   * Roles that can access the route
   */
  roles?: Role[];
}

export interface RouteDefinition extends SolidRouteDef {
  meta?: RouteMeta;
}

const routes: RouteDefinition[] = [];

const featureRoutes = import.meta.glob<RouteDefinition[]>(
  '../features/*/routes/_index.ts',
  {
    eager: true,
    import: 'routes',
  }
);

for (const [_path, importedRoutes] of Object.entries(featureRoutes)) {
  for (const route of importedRoutes) {
    if (route.meta?.authentication !== AuthStatus.SIGNED_IN) {
      routes.push(route);
      continue;
    }

    const Component = route.component as () => JSX.Element;

    const guardedRoute: RouteDefinition = {
      ...route,
      component: () => (
        <RouteGuard
          roles={route.meta?.roles ?? []}
          authStatus={AuthStatus.SIGNED_IN}
        >
          <Component />
        </RouteGuard>
      ),
    };

    routes.push(guardedRoute);
  }
}

export { routes };

