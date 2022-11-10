<script lang="ts">
  import router from "page";
  import type { RouteInfo } from "../routes";
  import type { ComponentType } from "svelte";
  import Home from "../pages/Home.svelte";
  import About from "../pages/About.svelte";

  export let routeInfo: RouteInfo;
  export let baseLayout: ComponentType = routeInfo.baseLayout;
  let currentPage;
  let currentRoute;

  const prefix = routeInfo.prefix;
  if (prefix) {
    router.base(prefix);
  }
  routeInfo.routes.forEach((route) => {
    const fullRoute = route.name;
    router(fullRoute, () => {
      currentPage = route.component;
      currentRoute = route.name;
    });
  });

  router.start();
</script>

{#if baseLayout}
  <svelte:component this={baseLayout} mainContent={currentPage} />
{:else}
  <svelte:component this={currentPage} />
{/if}
