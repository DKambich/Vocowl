<script lang="ts">
  import { TabItem, Tabs, Tooltip } from "flowbite-svelte";
  import {
    CustomRestaurant,
    ManageRestaurant,
    NearbyRestaurant,
    SearchRestaurant,
  } from "./index";
  import { LocationModal } from "../shared";
  import { preferences } from "../../stores/preferencesStore";
  import { PageBaseline } from "../meta";
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
    class="text-right mb-4 text-xs font-semibold text-slate-600 dark:text-white"
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
  <Tabs
    style="full"
    defaultClass="flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-500 dark:border-solid dark:border-2 dark:border-gray-500"
  >
    <!-- Search Restaurant -->
    <TabItem open class="w-full ">
      <div slot="title" class="flex justify-center items-center gap-2">
        <MagnifyingGlass size="18" />
        <span class="hidden sm:block">Search</span>
      </div>
      <SearchRestaurant location={userLocation} />
    </TabItem>
    <Tooltip class="sm:hidden" placement="bottom">
      Add Searched Restaurant
    </Tooltip>

    <!-- Nearby Restaurant -->
    <TabItem class="w-full">
      <div slot="title" class="flex justify-center items-center gap-2">
        <Map size="18" />
        <span class="hidden sm:block">Nearby</span>
      </div>
      <NearbyRestaurant location={userLocation} />
    </TabItem>
    <Tooltip class="sm:hidden" placement="bottom">
      Add Nearby Restaurant
    </Tooltip>

    <!-- Custom Restaurant -->
    <TabItem class="w-full">
      <div slot="title" class="flex justify-center items-center gap-2">
        <PencilSquare size="18" />
        <span class="hidden sm:block">Custom</span>
      </div>
      <CustomRestaurant />
    </TabItem>
    <Tooltip class="sm:hidden" placement="bottom">
      Add Custom Restaurant
    </Tooltip>

    <!-- Manage Restaurant -->
    <TabItem class="w-full">
      <div slot="title" class="flex justify-center items-center gap-2">
        <ListBullet size="18" />
        <span class="hidden sm:block">Manage</span>
      </div>
      <ManageRestaurant />
    </TabItem>
    <Tooltip class=" sm:hidden" placement="bottom">Manage Restaurants</Tooltip>
  </Tabs>
</PageBaseline>
