<script lang="ts">
  import { Loader, LoaderStatus } from "@googlemaps/js-api-loader";
  import { map } from "../stores/googleMapsStore";
  import { GOOGLE_MAPS_API_KEY } from "../credentials";

  let loading = true;
  let successful = false;
  var googleMapsLoader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  googleMapsLoader.load().then((google) => {
    loading = false;
    successful = googleMapsLoader.status === LoaderStatus.SUCCESS;
    map.set(new google.maps.Map(document.getElementById("map")));
  });
</script>

{#if loading}
  <slot name="loading">Loading</slot>
{:else if !loading && successful}
  <slot name="success">Success</slot>
{:else if !loading && !successful}
  <slot name="failure">Failure</slot>
{/if}
