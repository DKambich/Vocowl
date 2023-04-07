<script lang="ts">
  import { Button, Modal } from "flowbite-svelte";
  import * as Leaflet from "leaflet";
  import { MapPin } from "svelte-heros-v2";
  import type { LatLng, Restaurant } from "../../types";
  import {
    getFormattedAddress,
    getGoogleMapsDirectionsURL,
  } from "../../utilities";

  // External Variables
  export let restaurant: Restaurant;
  export let open = false;

  // Component Variables
  let leafletMap: Leaflet.Map;
  let selectedLatLng: LatLng;

  // Component Setup
  function initMap(container: HTMLElement) {
    selectedLatLng = restaurant.location;

    leafletMap = Leaflet.map(container, {
      boxZoom: false,
      closePopupOnClick: false,
      doubleClickZoom: false,
      dragging: false,
      scrollWheelZoom: false,
      touchZoom: false,
      zoomControl: false,
    })
      .setView(selectedLatLng, 14)
      .addLayer(
        Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
      );

    Leaflet.marker(selectedLatLng)
      .addTo(leafletMap)
      .bindPopup(
        `<div class="flex flex-col gap-2 items-center">
            <b>${restaurant.name}</b>
            ${getFormattedAddress(restaurant.address)}
        </div>`,
        {
          autoClose: false,
          closeButton: false,
          closeOnClick: false,
          closeOnEscapeKey: false,
        }
      )
      .openPopup();

    return {
      destroy: () => {
        leafletMap?.remove();
      },
    };
  }

  // Component Functions
  function openMapDirections(restaurant: Restaurant) {
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
      <div class="w-[80vw] h-[30vh] md:w-[500px] md:h-[500px]" use:initMap />
    {:else if restaurant.address}
      <address>{getFormattedAddress(restaurant.address)}</address>
    {/if}
  </div>
  <div slot="footer" class="flex justify-center gap-2">
    {#if restaurant.address}
      <Button color="primary" on:click={() => openMapDirections(restaurant)}>
        <MapPin size="18" class="mr-1" />
        <span class="font-bold">Get Directions</span>
      </Button>
    {/if}
    <Button color="alternative" on:click={() => (open = false)}>
      <span class="font-bold">Close</span>
    </Button>
  </div>
</Modal>
