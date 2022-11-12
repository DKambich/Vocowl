import { ABOUT_ROUTE, HOME_ROUTE, SEARCH_ROUTE } from "./constants";
import { About, Home, NotFound, Search } from "./pages";

const routes = {};
routes[HOME_ROUTE] = Home;
routes[ABOUT_ROUTE] = About;
routes[SEARCH_ROUTE] = Search;
routes["*"] = NotFound;

export { routes, HOME_ROUTE, ABOUT_ROUTE, SEARCH_ROUTE };
