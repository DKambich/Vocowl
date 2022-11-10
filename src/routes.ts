import type { ComponentType } from "svelte";
import About from "./pages/About.svelte";
import Home from "./pages/Home.svelte";
import PageLayout from "./pages/PageLayout.svelte";
import Search from "./pages/Search.svelte";

export type Route = {
  name: string;
  component: ComponentType;
};
export type RouteInfo = {
  prefix?: string;
  baseLayout?: ComponentType;

  routes: Route[];
};

const routeInfo: RouteInfo = {
  prefix: "/Vocowl",
  baseLayout: PageLayout,
  routes: [
    {
      name: "/",
      component: Home,
    },
    {
      name: "/about",
      component: About,
    },
    {
      name: "/search",
      component: Search,
    },
  ],
};

export { routeInfo };
