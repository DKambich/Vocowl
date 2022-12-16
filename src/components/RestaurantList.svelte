<script>
  import { preferences } from "../stores/preferencesStore";

  let restaurants = $preferences.restaurants;
</script>

{#each restaurants as restaurant }
    <div class="dark:text-white">{restaurant.name}</div>
{/each}