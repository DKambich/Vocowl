<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { Megaphone } from "svelte-heros-v2";
  import { Slot } from ".";
  import { localStorage } from "../../stores/localStorageStore";
  import type { Restaurant } from "../../types";
  import { PageBaseline } from "../meta";
  import { IconMessage } from "../shared";
  import { RestaurantSelector } from "./";

  let restaurants = $localStorage.restaurants;
  let isSpinning = false;

  // Variable Bindings
  let filteredRestaurants: Restaurant[] = [];
  let startReel;

  function onReelStart() {
    isSpinning = true;
  }

  function onReelEnd(res: Restaurant) {
    isSpinning = false;
    alert(`${res.name} Won!!!`);
  }
</script>

<PageBaseline>
  <div class="flex-1 grid grid-rows-2 grid-cols-1 lg:grid-cols-5 gap-4">
    <div
      class="col-span-1 row-span-2 min-h-[50vh] lg:col-span-3 lg:row-span-1 lg:min-h-0 flex flex-col gap-2"
    >
      {#if filteredRestaurants.length > 0}
        {#key filteredRestaurants.length}
          <Slot
            reelItems={filteredRestaurants}
            reelItemBuilder={(res) => res.name}
            {onReelStart}
            {onReelEnd}
            bind:startReel
          />
        {/key}
        <Button
          color="primary"
          disabled={isSpinning}
          size="xl"
          on:click={startReel}
        >
          Decide!
        </Button>
      {:else}
        <div class="flex-1 flex justify-center">
          <IconMessage icon={Megaphone} size="xl">
            Start deciding by adding at least one restaurant
          </IconMessage>
        </div>
      {/if}
    </div>
    <div
      class="col-span-1 row-span-2 min-h-[50vh] lg:col-span-2 lg:row-span-1 lg:min-h-0  relative"
    >
      <RestaurantSelector
        {restaurants}
        bind:filteredRestaurants
        disabled={isSpinning}
      />
    </div>
  </div>
</PageBaseline>
