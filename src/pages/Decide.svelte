<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { PageBaseline } from ".";
  import { preferences } from "../stores/preferencesStore";
  let restaurants = $preferences.restaurants;
</script>

<PageBaseline>
  <div class="flex flex-col justify-center items-center">
    <div class="dark:text-white">Decide Page</div>
    {#each restaurants as restaurant}
      {restaurant.name}<br />
    {/each}
    <Button color="primary" size="xl" class="w-full md:w-auto">Spin</Button>
  </div>
</PageBaseline>
