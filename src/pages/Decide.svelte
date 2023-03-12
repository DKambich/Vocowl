<script lang="ts">
  import { Button } from "flowbite-svelte";
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
    <div class="col-span-2">
      {#each restaurants as restaurant}
        {restaurant.name}<br />
      {/each}
    </div>
  </div>
</PageBaseline>
