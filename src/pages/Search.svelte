<script lang="ts">
  import Zipcode from "../components/Zipcode.svelte";
  import { PageBaseline } from "./";

  let userLocation: google.maps.LatLngLiteral;
</script>

<PageBaseline>
  <Zipcode bind:userLocation />
  {#if userLocation}
    {userLocation.lat}
    {userLocation.lng}
  {/if}
</PageBaseline>
