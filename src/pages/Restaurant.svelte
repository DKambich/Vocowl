<script lang="ts">
  import { TabItem, Tabs } from "flowbite-svelte";
  import {
    LocationModal,
    CustomRestaurant,
    NearbyRestaurant,
    SearchRestaurant,
  } from "../components";
  import { preferences } from "../stores/preferencesStore";
  import { PageBaseline } from ".";
  import {
    ListBullet,
    MagnifyingGlass,
    Map,
    PencilSquare,
  } from "svelte-heros-v2";

  $: userLocation = $preferences.location.latlng;
  $: userZipcode = $preferences.location.zipcode;
  let isLocationModalOpen = false;
</script>

<PageBaseline>
  <div
    class="text-right mt-4 xs:mx-1 text-xs font-semibold text-slate-600 dark:text-white"
  >
    <div>
      {#if userZipcode}
        Currently Using {userZipcode}
      {:else}
        No Location Set
      {/if}
    </div>
    <a
      href="/"
      class="font-semibold underline underline-offset-2 cursor-pointer"
      on:click|preventDefault={() => (isLocationModalOpen = true)}
    >
      Update Your Location
    </a>
  </div>
  <div />
  <LocationModal bind:open={isLocationModalOpen} />
  <Tabs style="underline">
    <TabItem open>
      <div slot="title" class="flex items-center gap-2">
        <MagnifyingGlass size="18" />
        Search
      </div>
      <SearchRestaurant location={userLocation} />
    </TabItem>
    <TabItem>
      <div slot="title" class="flex items-center gap-2">
        <Map size="18" />
        Nearby
      </div>
      <NearbyRestaurant location={userLocation} />
    </TabItem>
    <TabItem>
      <div slot="title" class="flex items-center gap-2">
        <PencilSquare size="18" />
        Custom
      </div>
      <CustomRestaurant />
    </TabItem>
    <TabItem>
      <div slot="title" class="flex items-center gap-2">
        <ListBullet size="18" />
        Manage
      </div>
      This is the Restaurant Manager list
    </TabItem>
  </Tabs>
</PageBaseline>
