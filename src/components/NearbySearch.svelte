<script lang="ts">
  import { Listgroup, ListgroupItem } from "flowbite-svelte";
  import { onMount } from "svelte";
  let buttons = Array(20)
    .fill(0)
    .map((x, i) => ({ name: i }));

  onMount(async () => {
    new google.maps.Map(document.getElementById("nearbyMap"), {
      // TODO: Update this to be the user's current location
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  });
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div
    id="nearbyMap"
    class="bg-red-500 col-span-1 lg:col-span-2 rounded-lg h-[500px]"
  >
    Map
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
