export const LAYOUTS = {
  HOME: 'home',
  GUEST: 'guest',
} as const;

export const ROUTES_NAVIGATION = {
  DASHBOARD: ['/', 'dashboard'],
  AUTH: ['/', 'auth'],
  SIGN_IN: ['/', 'auth', 'sign-in'],
  SIGN_UP: ['/', 'auth', 'sign-up'],
} as const;

type RouteMap = typeof ROUTES_NAVIGATION;

type LastSegments = {
  [K in keyof RouteMap]: RouteMap[K] extends readonly (infer U)[] ? U : never;
};

export const ROUTES_DECLARATION: LastSegments = Object.fromEntries(
  Object.entries(ROUTES_NAVIGATION).map(([key, path]) => [key, path.at(-1)]),
) as LastSegments;
