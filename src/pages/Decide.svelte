<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { PageBaseline } from ".";
  import Slot from "../components/Slot.svelte";
  import { preferences } from "../stores/preferencesStore";
  import type { Restaurant } from "../types";
  let restaurants = $preferences.restaurants;

  let startReel;
  function onReelEnd(test: Restaurant) {
    console.log("ENDED:", test);
  }
</script>

<PageBaseline>
  <div class="flex flex-col justify-center items-center">
    <div class="dark:text-white">Decide Page</div>
    <Slot
      options={restaurants}
      optionBuilder={(res) => res.name}
      {onReelEnd}
      bind:startReel
    />
    <!-- {#each restaurants as restaurant}
      {restaurant.name}<br />
    {/each} -->
    <Button
      color="primary"
      size="xl"
      class="w-full md:w-auto"
      on:click={startReel}>Spin</Button
    >
  </div>
</PageBaseline>
