<script lang="ts">
  import { Label, Listgroup, ListgroupItem, P, Range } from "flowbite-svelte";
  import { afterUpdate } from "svelte";
  import { PlusCircle } from "svelte-heros-v2";
  import { MILES_TO_METERS } from "../constants";

  let buttons = Array(20)
    .fill(0)
    .map((x, i) => ({ name: i }));

  // External user location
  export let location: google.maps.LatLngLiteral;
  // Internal state variables
  let nearbyMap: google.maps.Map;
  let searchCircle: google.maps.Circle;
  let searchRadius = 5;

  // Update map center and search radius center when location changes
  $: {
    // TODO: Run the nearby places search
    nearbyMap?.moveCamera({ center: location });
    searchCircle?.setCenter(location);
  }

  // Update map center and search radius center when location changes
  $: {
    // TODO: Run the nearby places search
    searchCircle?.setRadius(searchRadius * MILES_TO_METERS);
  }

  // After DOM has loaded, load in the the nearby search map and search radius
  afterUpdate(() => {
    if (location && !nearbyMap) {
      nearbyMap = new google.maps.Map(document.getElementById("nearbyMap"), {
        center: location,
        zoom: 11,
      });
      searchCircle = new google.maps.Circle({
        map: nearbyMap,
        center: location,
        radius: searchRadius * MILES_TO_METERS,
        strokeWeight: 0,
        fillColor: "#5850EC",
        fillOpacity: 0.35,
      });
    }
  });

  function updateRadius() {
    // TODO: Set the new locations
  }

  console.log();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div
    id="nearbyMap"
    class="flex justify-center items-center col-span-1 lg:col-span-2 rounded-lg h-[500px]"
  >
    <P size="xl"
      >Cannot load map until a location has been provided. Please update your
      location.</P
    >
  </div>
  <div class="flex flex-col max-h-[500px] gap-y-4">
    <div>
      <Label>Search Radius: {searchRadius} miles</Label>
      <Range
        min="1"
        max="10"
        bind:value={searchRadius}
        on:change={updateRadius}
      />
    </div>
    <Listgroup class="h-fit overflow-auto grow">
      <h3
        class="text-center bg-primary-700 py-2 text-white font-bold rounded-t-lg sticky top-0"
      >
        Nearby Results
      </h3>
      {#each buttons as button}
        <div class="px-2">
          <ListgroupItem class="flex items-center">
            <div class="grow wrap pr-2">
              <div class="font-bold break-all">
                {button.name.toString().repeat(35)}
              </div>
              <div class="font-semibold underline  break-all">
                123 Apple Street
              </div>
            </div>
            <PlusCircle class="min-w-max" />
          </ListgroupItem>
        </div>
      {/each}
      {#if buttons.length === 0}
        <div class="text-center py-4">No Results Found...</div>
      {/if}
    </Listgroup>
  </div>
</div>
