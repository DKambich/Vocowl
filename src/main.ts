import "./app.postcss";
import "./stores/themeStore";

import App from "./App.svelte";

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
  let map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 30, lng: -110 },
    zoom: 8,
  });
};

export default app;
