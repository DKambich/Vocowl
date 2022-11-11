<script lang="ts">
  import { GOOGLE_MAPS_API_KEY } from "./credentials";
  import Router from "svelte-spa-router";
  import { routes } from "./routes";

  export let googleMapsReady;
</script>

<svelte:head>
  <script
    defer
    async
    type="text/javascript"
    src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`}
  ></script>
</svelte:head>

<Router {routes} />
