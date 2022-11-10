import "./app.postcss";
import "./stores/themeStore";
import "./stores/googleMapsStore";

import App from "./App.svelte";
import { map } from "./stores/googleMapsStore";

const app = new App({
  target: document.getElementById("app"),
  props: {
    googleMapsReady: false,
  },
});

declare global {
  interface Window {
    initMap: () => void;
  }
}

window.initMap = function ready() {
  app.$set({ googleMapsReady: true });
  map.set(new google.maps.Map(document.getElementById("map") as HTMLElement));
};

export default app;
