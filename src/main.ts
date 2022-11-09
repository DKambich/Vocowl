import "./app.postcss";
import "./stores/themeStore";

import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
