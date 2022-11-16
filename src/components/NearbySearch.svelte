<script lang="ts">
  import { Listgroup, ListgroupItem, P } from "flowbite-svelte";
  import { afterUpdate, onMount } from "svelte";
  let buttons = Array(20)
    .fill(0)
    .map((x, i) => ({ name: i }));

  export let location: google.maps.LatLngLiteral;
  let nearbyMap: google.maps.Map;

  //
  onMount(async () => {
    if (location) {
      nearbyMap = new google.maps.Map(document.getElementById("nearbyMap"), {
        center: location,
        zoom: 12,
      });
    }
  });

  afterUpdate(() => {
    if (location && !nearbyMap) {
      nearbyMap = new google.maps.Map(document.getElementById("nearbyMap"), {
        center: location,
        zoom: 12,
      });
    }
  });
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div
    id="nearbyMap"
    class="flex justify-center items-center col-span-1 lg:col-span-2 rounded-lg h-[500px]"
  >
    <P size="xl">Cannot load map until a location has been provided. Please update your location.</P>
  </div>
  <Listgroup class="h-fit max-h-[500px] overflow-auto">
    <h3
      class="text-center bg-primary-700 py-2 text-white font-bold rounded-t-lg sticky top-0"
    >
      Nearby Results
    </h3>
    {#each buttons as button}
      <ListgroupItem class="text-base font-semibold gap-2">
        {button.name}
      </ListgroupItem>
    {/each}
    {#if buttons.length === 0}
      <div class="text-center py-4">No Results Found...</div>
    {/if}
  </Listgroup>
</div>
