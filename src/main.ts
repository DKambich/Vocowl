import "./app.postcss";
import "./stores/preferencesStore";
import "./stores/googleMapsStore";

import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
