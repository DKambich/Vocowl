import "./app.postcss";
import "./stores/localStorageStore";

import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
