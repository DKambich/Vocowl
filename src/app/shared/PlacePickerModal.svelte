<script lang="ts">
  import { Button, Modal } from "flowbite-svelte";
  import * as Leaflet from "leaflet";
  import { getContext } from "svelte";
  import { GEOCODE_SERVICE } from "../../constants";
  import type { IGeocodingService } from "../../services/IGeocodingService";
  import type { Address, LatLng } from "../../types";

  export let initialLocation: LatLng;
  export let open = true;
  export let onLocationSelected = (address: Address, location: LatLng) => {};

  let leafletMap: Leaflet.Map;
  let placeMarker: Leaflet.Marker;
  let placeInfoControl: Leaflet.Control & {
    setDisplayedCoordinates: (coords: LatLng) => void;
  };

  const geocodeService = getContext<IGeocodingService>(GEOCODE_SERVICE);

  let selectedLatLng: LatLng;

  const PlaceInfoControl = Leaflet.Control.extend({
    onAdd: function () {
      const coordsDiv: HTMLDivElement = Leaflet.DomUtil.create("div");
      coordsDiv.className = "text-black font-semibold bg-gray-100 p-1 rounded ";

      return coordsDiv;
    },
    setDisplayedCoordinates: function ({ lat, lng }: LatLng) {
      this.getContainer().innerHTML = `Latitude: ${lat.toFixed(
        4
      )} Longitude: ${lng.toFixed(4)}`;
    },
  });

  function createMap(container) {
    selectedLatLng = initialLocation ?? {
      lat: 39.5,
      lng: -98.34,
    };
    let startingZoom = initialLocation ? 12 : 4;

    leafletMap = Leaflet.map(container, { preferCanvas: true }).setView(
      selectedLatLng,
      startingZoom
    );

    Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 3,
      maxZoom: 16,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap);

    placeMarker = Leaflet.marker(selectedLatLng, {
      riseOnHover: true,
      draggable: true,
    }).addTo(leafletMap);

    placeInfoControl = new PlaceInfoControl({
      position: "bottomleft",
    }).addTo(leafletMap);
    placeInfoControl.setDisplayedCoordinates(selectedLatLng);

    leafletMap.on("click", (clickEvent) => {
      selectedLatLng = clickEvent.latlng;
      placeMarker.setLatLng(selectedLatLng);
      placeInfoControl.setDisplayedCoordinates(selectedLatLng);
    });

    placeMarker.on("drag", function (dragEvent) {
      selectedLatLng = (dragEvent as Leaflet.LeafletMouseEvent).latlng;
      placeInfoControl.setDisplayedCoordinates(selectedLatLng);
    });

    return leafletMap;
  }

  function mapAction(container) {
    leafletMap = createMap(container);
    return {
      destroy: () => {
        leafletMap.remove();
      },
    };
  }

  async function pickPlace() {
    const [address, error] = await geocodeService.getAddressFromLocation(
      selectedLatLng
    );
    if (error) {
      // TODO: Handle error
    } else {
      onLocationSelected(address, selectedLatLng);
      open = false;
    }
  }

  function reset() {
    selectedLatLng = null;
  }
</script>

<Modal title="Place Picker" size="xl" bind:open on:hide={reset}>
  <div
    class="w-[80vw] md:w-[700px] lg:w-[900px] xl:w-[1200px] h-[50vh]"
    use:mapAction
  />
  <div slot="footer" class="font-bold">
    <Button color="primary" on:click={pickPlace} disabled={!selectedLatLng}
      >Set Location</Button
    >
    <Button color="alternative" on:click={() => (open = false)}>Close</Button>
  </div>
</Modal>
