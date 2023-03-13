import { HOME_ROUTE, RESTAURANT_ROUTE, DECIDE_ROUTE } from "./constants";
import Home from "./app/home/Home.svelte";
import { NotFound } from "./app/meta";
import Restaurant from "./app/restaurant/Restaurant.svelte";
import Decide from "./app/decide/Decide.svelte";

const routes = {};
routes[DECIDE_ROUTE] = Decide;
routes[HOME_ROUTE] = Home;
routes[RESTAURANT_ROUTE] = Restaurant;
routes["*"] = NotFound;

export { routes, HOME_ROUTE, RESTAURANT_ROUTE, DECIDE_ROUTE };
