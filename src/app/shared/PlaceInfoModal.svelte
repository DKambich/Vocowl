<script lang="ts">
  import { Button, Modal } from "flowbite-svelte";
  import * as Leaflet from "leaflet";
  import { MapPin } from "svelte-heros-v2";
  import type { LatLng, Restaurant } from "../../types";
  import {
    getFormattedAddress,
    getGoogleMapsDirectionsURL,
  } from "../../utilities";

  export let restaurant: Restaurant;
  export let open = false;

  let leafletMap: Leaflet.Map;
  let selectedLatLng: LatLng;

  function createMap(container) {
    selectedLatLng = restaurant.location;

    leafletMap = Leaflet.map(container, {
      boxZoom: false,
      closePopupOnClick: false,
      doubleClickZoom: false,
      dragging: false,
      touchZoom: false,
      zoomControl: false,
    }).setView(selectedLatLng, 14);

    Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 3,
      maxZoom: 16,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap);

    Leaflet.marker(selectedLatLng)
      .addTo(leafletMap)
      .bindPopup(
        `<div class="flex flex-col gap-2 items-center">
            <b>${restaurant.name}</b>
            ${getFormattedAddress(restaurant.address)}
        </div>`
      )
      .openPopup();
    return leafletMap;
  }

  function mapAction(container) {
    leafletMap = createMap(container);

    return {
      destroy: () => {
        leafletMap?.remove();
      },
    };
  }

  function openDirections(restaurant: Restaurant) {
    const directionsURL = getGoogleMapsDirectionsURL(restaurant);
    window.open(directionsURL, "_blank");
  }
</script>

<Modal title={restaurant?.name} bind:open>
  <div class="flex flex-col items-center">
    <span class="text-lg font-semibold mb-2">
      {restaurant.name} was selected!
    </span>
    {#if restaurant.location}
      <div class="w-[80vw] md:w-[500px] h-[30vh] md:h-[500px]" use:mapAction />
    {:else if restaurant.address}
      <address>{getFormattedAddress(restaurant.address)}</address>
    {/if}
  </div>
  <div slot="footer" class="flex justify-center gap-2">
    {#if restaurant.address || restaurant.location}
      <Button color="primary" on:click={() => openDirections(restaurant)}>
        <MapPin size="18" class="mr-1" />
        <span class="font-bold">Get Directions</span>
      </Button>
    {/if}
    <Button color="alternative" on:click={() => (open = false)}>
      <span class="font-bold">Close</span>
    </Button>
  </div>
</Modal>
