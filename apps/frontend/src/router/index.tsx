import { LayoutProps } from '@/lib/utils';
import { UserRole } from '@isi-insight/client';
import { Navigate, type RouteDefinition as SolidRouteDef } from '@solidjs/router';
import { JSX } from 'solid-js';
import { AuthStatus } from '../lib/constants';
import RouteGuard from './RouteGuard';

export interface SignedIn {
  status: AuthStatus.SIGNED_IN;
  /**
   * Roles that can access the route.
   */
  roles?: UserRole[];
}

export interface SignedOut {
  status: AuthStatus.SIGNED_OUT;
}

export type RouteAuthentication = SignedIn | SignedOut;

export interface RouteMeta {
  authentication?: RouteAuthentication;
}

export interface RouteDefinition extends SolidRouteDef {
  meta?: RouteMeta;
  children?: RouteDefinition | RouteDefinition[];
}

const routes: RouteDefinition[] = [];

const featureRoutes = import.meta.glob<RouteDefinition[]>(
  '../features/*/routes/_index.ts',
  {
    eager: true,
    import: 'routes',
  }
);

const rootRedirectRoute = {
  path: '/',
  component: () => <Navigate href="/projects" />,
}

routes.unshift(rootRedirectRoute);

const mapRoute = (route: RouteDefinition) => {
  if (route.meta?.authentication === undefined) {
    return route;
  }

  const Component = route.component ?? (() => null);

  const guardedRoute: RouteDefinition = {
    ...route,
    // sorry not sorry for the ternary
    children: Array.isArray(route.children)
      ? route.children.map(mapRoute)
      : route.children === undefined
        ? undefined
        : mapRoute(route.children),
    component: (props) => (
      <RouteGuard authentication={route.meta!.authentication!}>
        <Component {...props} />
      </RouteGuard>
    ),
  };

  return guardedRoute;
};

for (const [_path, importedRoutes] of Object.entries(featureRoutes)) {
  for (const route of importedRoutes) {
    routes.push(mapRoute(route));
  }
}

export { routes };
