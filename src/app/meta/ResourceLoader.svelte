<script lang="ts">
  import * as Leaflet from "leaflet";
  import "leaflet-geosearch/dist/geosearch.css";
  import icon from "leaflet/dist/images/marker-icon.png";
  import iconShadow from "leaflet/dist/images/marker-shadow.png";
  import "leaflet/dist/leaflet.css";
  import { setContext } from "svelte";
  import { GEOCODE_SERVICE, POI_SERVICE } from "../../constants";
  import { GeocodeGeocodingService } from "../../services/GeocodeGeocodingService";
  import { HerePOIService } from "../../services/HerePOIService";
  import type { IGeocodingService } from "../../services/IGeocodingService";
  import type { IPOIService } from "../../services/IPOIService";

  // Override default marker icon so it loads correctly
  let DefaultIcon = Leaflet.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });
  Leaflet.Marker.prototype.options.icon = DefaultIcon;

  // Load any application resources
  let loading = true;
  let successful = false;

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
