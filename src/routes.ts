import { Decide } from "./app/decide/";
import { Home } from "./app/home/";
import { NotFound } from "./app/meta";
import { Restaurant } from "./app/restaurant";
import { DECIDE_ROUTE, HOME_ROUTE, RESTAURANT_ROUTE } from "./constants";

const routes = {};
routes[DECIDE_ROUTE] = Decide;
routes[HOME_ROUTE] = Home;
routes[RESTAURANT_ROUTE] = Restaurant;
routes["*"] = NotFound;

export { routes, HOME_ROUTE, RESTAURANT_ROUTE, DECIDE_ROUTE };
