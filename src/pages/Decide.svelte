<script lang="ts">
  import { Button, Checkbox, Listgroup, ListgroupItem } from "flowbite-svelte";
  import { PageBaseline } from ".";
  import Slot from "../components/Slot.svelte";
  import { preferences } from "../stores/preferencesStore";
  import type { Restaurant } from "../types";
  let restaurants = $preferences.restaurants;

  let startReel;
  function onReelEnd(res: Restaurant) {
    alert(`${res.name} Won!!!`);
  }
</script>

<PageBaseline>
  <div class="flex-1 grid grid-rows-2 grid-cols-1 lg:grid-cols-5 gap-4">
    <div class="col-span-3 flex flex-col gap-2">
      <Slot
        reelItems={restaurants}
        reelItemBuilder={(res) => res.name}
        {onReelEnd}
        bind:startReel
      />
      <div class="flex-none">
        <Button color="primary" size="xl" class="w-full" on:click={startReel}>
          Spin
        </Button>
      </div>
    </div>
    <div class="col-span-2 h-full relative">
      <Listgroup class="absolute top-0 right-0 left-0 bottom-0 overflow-scroll">
        <div
          class="bg-primary-700 text-white font-bold text-center sticky top-0 py-2"
        >
          Selected Restaurants
        </div>
        {#each [...restaurants] as restaurant}
          <ListgroupItem>
            <Checkbox class="w-100">{restaurant.name}</Checkbox>
          </ListgroupItem>
        {/each}
      </Listgroup>
    </div>
  </div>
</PageBaseline>
