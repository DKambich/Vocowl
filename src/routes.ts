import { HOME_ROUTE, RESTAURANT_ROUTE, DECIDE_ROUTE } from "./constants";
import { Home, NotFound, Restaurant, Decide } from "./pages";

const routes = {};
routes[DECIDE_ROUTE] = Decide;
routes[HOME_ROUTE] = Home;
routes[RESTAURANT_ROUTE] = Restaurant;
routes["*"] = NotFound;

export { routes, HOME_ROUTE, RESTAURANT_ROUTE, DECIDE_ROUTE };
