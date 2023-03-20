<script lang="ts">
  import { Loader, LoaderStatus } from "@googlemaps/js-api-loader";
  import { setContext } from "svelte";
  import { GOOGLE_MAPS_API_KEY } from "../../credentials";
  import { GeocodeGeocodingService } from "../../services/GeocodingService";
  import type { IGeocodingService } from "../../services/IGeocodingService";
  import { map } from "../../stores/googleMapsStore";

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
  setContext<IGeocodingService>("geocoding", new GeocodeGeocodingService());
  loading = false;
  successful = true;
</script>

{#if loading}
  <slot name="loading">Loading</slot>
{:else if !loading && successful}
  <slot name="success">Success</slot>
{:else if !loading && !successful}
  <slot name="failure">Failure</slot>
{/if}
