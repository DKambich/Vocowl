import About from "./pages/About.svelte";
import Home from "./pages/Home.svelte";
import NotFound from "./pages/NotFound.svelte";
import Search from "./pages/Search.svelte";

export const routes = {
  "/": Home,
  "/about/": About,
  "/search/": Search,
  "*": NotFound,
};
