<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    Button,
    Checkbox,
    Label,
    Listgroup,
    ListgroupItem,
    Range,
  } from "flowbite-svelte";
  import * as Leaflet from "leaflet";
  import { afterUpdate, getContext } from "svelte";
  import {
    MagnifyingGlass,
    MapPin,
    MinusCircle,
    PlusCircle,
  } from "svelte-heros-v2";
  import { MILES_TO_METERS, POI_SERVICE } from "../../../constants";
  import type { IPOIService } from "../../../services/IPOIService";
  import {
    addRestaurant,
    localStorage,
    removeRestaurant,
  } from "../../../stores/localStorageStore";
  import { showToast } from "../../../stores/toastStore";
  import type { LatLng, Restaurant } from "../../../types";
  import { IconMessage } from "../../shared";

  // User Location Variables
  export let userLocation: LatLng;
  let cachedLocation = userLocation;

  // Map state Variables
  let nearbyLMap: Leaflet.Map;
  let searchCircle: Leaflet.Circle;
  let mapLayer: Leaflet.TileLayer = Leaflet.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      minZoom: 6,
      maxZoom: 16,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  let nearbyRestaurants: Restaurant[] = [];
  let nearbyMarkers: L.Marker[] = [];

  // Internal Search Options state variables
  let searchRadius = 5;
  const RANK_DISTANCE = google.maps.places.RankBy.DISTANCE.toString();
  const RANK_PROMINENCE = google.maps.places.RankBy.PROMINENCE.toString();
  let rankBy = RANK_PROMINENCE;
  let openNow = true;
  $: savedRestaurants = $localStorage.restaurants;

  const poiService = getContext<IPOIService>(POI_SERVICE);

  // Update map center and search radius center when location changes
  $: if (userLocation != cachedLocation) {
    nearbyLMap?.setView(userLocation);
    nearbyLMap?.setZoom(12);
    searchCircle?.setLatLng(userLocation);
    if (userLocation && nearbyLMap) loadNearbyRestaurants();
    cachedLocation = userLocation;
  }

  // Update map search circle when search radius changes
  $: {
    searchCircle?.setRadius(searchRadius * MILES_TO_METERS);
  }

  // Map Style Toggle on App Theme
  $: darkMode = $localStorage.useDarkTheme;
  $: {
    nearbyLMap?.removeLayer(mapLayer);
    if (darkMode) {
      mapLayer.setUrl("https://tile.openstreetmap.org/{z}/{x}/{y}.png");
    } else {
      mapLayer.setUrl("https://tile.openstreetmap.org/{z}/{x}/{y}.png");
    }
    nearbyLMap?.addLayer(mapLayer);
  }

  // After DOM has loaded, load in the the nearby search map and search radius
  afterUpdate(() => {
    if (location && !nearbyLMap) {
      nearbyLMap = Leaflet.map("nearbyMap", { preferCanvas: true }).setView(
        userLocation,
        12
      );
      searchCircle = Leaflet.circle(userLocation, {
        color: "#5850EC",
        fillOpacity: 0.35,
        radius: searchRadius * MILES_TO_METERS,
      }).addTo(nearbyLMap);
      Leaflet.marker(userLocation).addTo(nearbyLMap);
      // loadNearbyRestaurants();
    }
  });

  async function loadNearbyRestaurants() {
    // Clear nearby restaurants
    nearbyRestaurants = [];
    // Remove existing markers from map and clear markers
    nearbyMarkers.forEach((marker) => marker.remove());

    // Fetch the nearby restaurants based on current options
    const [restaurants, error] = await poiService.getNearbyRestaurants(
      userLocation,
      { radius: searchRadius * MILES_TO_METERS }
    );

    if (error) {
      // TODO: Handle error better
      console.error(error);
      showToast({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    } else {
      nearbyRestaurants = restaurants;
      nearbyMarkers = [
        ...restaurants.map(({ location }) =>
          Leaflet.marker(location).addTo(nearbyLMap)
        ),
      ];
    }

    // getNearbyRestaurants({
    //   map: nearbyMap,
    //   location: userLocation,
    //   rankBy: parseInt(rankBy),
    //   openNow: openNow,
    //   radius: searchRadius * MILES_TO_METERS,
    //   callback: handleNearbyRestaurants,
    // });
  }

  function centerMapOnRestaurant({ location }: Restaurant) {
    // Move the map to center on the restaurant location
    nearbyLMap?.setView(location);
    // Increase zoom level on restaurant location
    nearbyLMap?.setZoom(16);
  }

  function addMapRestaurant(restaurant: Restaurant) {
    addRestaurant(restaurant);
    showToast({
      message: `Added ${restaurant.name}`,
      type: "success",
    });
  }

  function removeMapRestaurant(restaurant: Restaurant) {
    removeRestaurant(restaurant);
    showToast({
      message: `Removed ${restaurant.name}`,
      type: "success",
    });
  }
</script>

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin=""
/>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
  <div
    id="nearbyMap"
    class="col-span-1 lg:col-span-2 rounded-lg flex justify-center h-[50vh] z-10"
  >
    {#if !nearbyLMap}
      <IconMessage icon={MapPin} size="xl">
        Update your location to load map
      </IconMessage>
    {/if}
  </div>
  <div class="col-span-1 flex flex-col max-h-[50vh]">
    <Listgroup class="h-fit overflow-auto grow">
      <h3
        class="text-center bg-primary-700 py-2 text-white font-bold rounded-t-lg sticky top-0"
      >
        Nearby Results
      </h3>
      {#each nearbyRestaurants as restaurant}
        <div class="px-2">
          <ListgroupItem class="flex items-center">
            <div class="grow wrap pr-2">
              <div class="font-bold break-all">
                {restaurant.name}
              </div>
            </div>
            <MapPin
              class="min-w-max px-2 cursor-pointer hover:text-primary-600"
              on:click={() => centerMapOnRestaurant(restaurant)}
            />
            {#if savedRestaurants.find((res) => res.id === restaurant.id)}
              <MinusCircle
                class="min-w-max cursor-pointer hover:text-primary-600"
                on:click={() => removeMapRestaurant(restaurant)}
              />
            {:else}
              <PlusCircle
                class="min-w-max cursor-pointer hover:text-primary-600"
                on:click={() => addMapRestaurant(restaurant)}
              />
            {/if}
          </ListgroupItem>
        </div>
      {/each}
      {#if nearbyRestaurants.length === 0}
        <IconMessage class="py-4" icon={MagnifyingGlass} size="sm">
          No Results Found...
        </IconMessage>
      {/if}
    </Listgroup>
    <Accordion flush>
      <AccordionItem>
        <span slot="header">Search Options</span>
        <div class="flex flex-col gap-4 items-stretch">
          <div>
            <Label>Search Radius ({searchRadius} miles)</Label>
            <Range
              min="1"
              max="10"
              bind:value={searchRadius}
              disabled={!nearbyLMap}
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <Checkbox checked={openNow} on:click={() => (openNow = !openNow)}>
              Fast Food
            </Checkbox>
            <Checkbox checked={openNow} on:click={() => (openNow = !openNow)}>
              Casual Dining
            </Checkbox>
            <Checkbox checked={openNow} on:click={() => (openNow = !openNow)}>
              Fine Dining
            </Checkbox>
          </div>

          <Button
            color="primary"
            disabled={!nearbyLMap}
            on:click={loadNearbyRestaurants}
          >
            Run Search
          </Button>
        </div>
      </AccordionItem>
    </Accordion>
  </div>
</div>
