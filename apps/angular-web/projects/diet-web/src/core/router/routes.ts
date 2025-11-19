export type RouteId = { id: symbol; declare: () => string };
export type Route = RouteId | { ROOT: RouteId; [key: Uppercase<string>]: Route };
export type Routes = Exclude<Route, RouteId>;

const r = ([route]: TemplateStringsArray): RouteId => ({ id: Symbol(route), declare: () => route });

export const ROUTES = {
  ROOT: r`/`,
  DASHBOARD: r`dashboard`,
  AUTH: {
    ROOT: r`auth`,
    SIGN_IN: r`sign-in`,
    SIGN_UP: r`sign-up`,
  },
  FRIDGE: {
    ROOT: r`fridge`,
    FOODS: {
      ROOT: r`foods`,
      FOOD: {
        ROOT: r`:foodId`,
        PORTIONS: r`portions`,
      },
    },
  },
} as const;
