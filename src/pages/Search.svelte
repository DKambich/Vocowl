<script lang="ts">
  import { TabItem, Tabs } from "flowbite-svelte";
  import { get } from "svelte/store";
  import ManualPlace from "../components/ManualPlace.svelte";
  import NearbySearch from "../components/NearbySearch.svelte";
  import PlacesSearch from "../components/PlacesSearch.svelte";
  import Zipcode from "../components/Zipcode.svelte";
  import { preferences } from "../stores/preferencesStore";
  import { PageBaseline } from "./";

  let userLocation: google.maps.LatLngLiteral =
    get(preferences).location.latlng;
</script>

<PageBaseline>
  <Zipcode bind:userLocation />
  <Tabs style="underline">
    <TabItem open title="Places Search">
      <PlacesSearch location={userLocation} />
    </TabItem>
    <TabItem title="Nearby Search">
      <NearbySearch location={userLocation} />
    </TabItem>
    <TabItem title="Custom Place"><ManualPlace /></TabItem>
  </Tabs>
</PageBaseline>
