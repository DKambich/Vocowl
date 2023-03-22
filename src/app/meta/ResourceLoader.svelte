<script lang="ts">
  import { Loader, LoaderStatus } from "@googlemaps/js-api-loader";
  import { setContext } from "svelte";
  import { GEOCODE_SERVICE, POI_SERVICE } from "../../constants";
  import { GeocodeGeocodingService } from "../../services/GeocodeGeocodingService";
  import { HerePOIService } from "../../services/HerePOIService";
  import type { IGeocodingService } from "../../services/IGeocodingService";
  import type { IPOIService } from "../../services/IPOIService";
  import { map } from "../../stores/googleMapsStore";

  let loading = true;
  let successful = false;
  var googleMapsLoader = new Loader({
    apiKey: "",
    libraries: ["places"],
  });

  googleMapsLoader.load().then((google) => {
    loading = false;
    successful = googleMapsLoader.status === LoaderStatus.SUCCESS;
    map.set(new google.maps.Map(document.getElementById("map")));
  });
  setContext<IGeocodingService>(GEOCODE_SERVICE, new GeocodeGeocodingService());
  setContext<IPOIService>(POI_SERVICE, new HerePOIService());

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
