<script lang="ts">
  import { GOOGLE_MAPS_API_KEY } from "./credentials";
  import Header from "./lib/Header.svelte";

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

<Header />

{#if googleMapsReady}{/if}
<div class="dark:text-white">Hello World</div>
