import type { RouteDefinition as SolidRouteDef } from '@solidjs/router';

export interface RouteMeta {}

export interface RouteDefinition extends SolidRouteDef {
  meta?: RouteMeta;
}

const routes: RouteDefinition[] = [];

const featureRoutes = import.meta.glob<RouteDefinition[]>(
  './features/*/routes/_index.ts',
  {
    eager: true,
    import: 'routes',
  }
);

for (const [_path, importedRoutes] of Object.entries(featureRoutes)) {
  routes.push(...importedRoutes);
}

export { routes };
