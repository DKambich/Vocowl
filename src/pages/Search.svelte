<script lang="ts">
  import { TabItem, Tabs } from "flowbite-svelte";
  import NearbySearch from "../components/NearbySearch.svelte";
  import Zipcode from "../components/Zipcode.svelte";
  import { PageBaseline } from "./";

  let userLocation: google.maps.LatLngLiteral;
</script>

<PageBaseline>
  <Zipcode bind:userLocation />
  <Tabs style="underline">
    <TabItem open title="Nearby Search"
      ><NearbySearch location={userLocation} /></TabItem
    >
    <TabItem title="Autocomplete">Autocomplete</TabItem>
  </Tabs>
  {#if userLocation}
    {userLocation.lat}
    {userLocation.lng}
  {/if}
</PageBaseline>
