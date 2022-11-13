<script lang="ts">
  import Router from "svelte-spa-router";
  import { routes } from "../routes";

  import { Loader, LoaderStatus } from "@googlemaps/js-api-loader";
  import { map } from "../stores/googleMapsStore";
  import { GOOGLE_MAPS_API_KEY } from "../credentials";

  import { Spinner } from "flowbite-svelte";
  import { Vocowl } from "./";

  let loading = true;
  let successful = false;
  var googleMapsLoader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  googleMapsLoader.load().then((google) => {
    loading = false;
    successful = googleMapsLoader.status == LoaderStatus.SUCCESS;
    map.set(new google.maps.Map(document.getElementById("map")));
  });
</script>

{#if loading}
  <div
    class="h-screen w-screen bg-white dark:bg-gray-800 flex flex-col justify-center items-center"
  >
    <div class="mb-4 text-indigo-600 dark:text-white">
      <Vocowl size={64} />
    </div>
    <Spinner color="purple" />
  </div>
{:else if !loading && successful}
  <Router {routes} />
{:else if !loading && !successful}
  <div>An error occured please reload the page</div>
{/if}
