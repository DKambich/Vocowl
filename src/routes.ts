import About from "./pages/About.svelte";
import Home from "./pages/Home.svelte";
import NotFound from "./pages/NotFound.svelte";
import Search from "./pages/Search.svelte";

const HOME_ROUTE: string = "/",
  ABOUT_ROUTE: string = "/about/",
  SEARCH_ROUTE: string = "/search/";

const routes = {};
routes[HOME_ROUTE] = Home;
routes[ABOUT_ROUTE] = About;
routes[SEARCH_ROUTE] = Search;
routes["*"] = NotFound;

export { routes, HOME_ROUTE, ABOUT_ROUTE, SEARCH_ROUTE };
