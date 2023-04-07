<script lang="ts">
  import { Button, Modal } from "flowbite-svelte";
  import * as Leaflet from "leaflet";
  import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
  import { showToast } from "../../stores/toastStore";
  import type { Address, LatLng } from "../../types";

  // Type Definitions
  type LocationCoordinateControl = Leaflet.Control & {
    setDisplayedCoordinates: (coords: LatLng) => void;
  };

  type SearchEvent = Leaflet.LeafletEvent & {
    location: {
      x: number;
      y: number;
      label: string;
      bounds: number[][];
    };
  };

  const PlaceInfoControl = Leaflet.Control.extend({
    onAdd: function () {
      const coordsDiv: HTMLDivElement = Leaflet.DomUtil.create("div");
      coordsDiv.className = "text-black font-semibold bg-white p-1 rounded-sm";
      coordsDiv.style.border = "2px solid rgba(0,0,0,0.2)";
      return coordsDiv;
    },
    setDisplayedCoordinates: function ({ lat, lng }: LatLng) {
      this.getContainer().innerHTML = `Latitude: ${lat.toFixed(
        4
      )}</br>Longitude: ${lng.toFixed(4)}`;
    },
  });

  // External Variables
  export let open = true;
  export let initialLocation: LatLng;
  export let onLocationSelected = (_: Address, __: LatLng) => {};

  // Component Variables
  let leafletMap: Leaflet.Map;
  let placeMarker: Leaflet.Marker;
  let placeInfoControl: LocationCoordinateControl;

  let selectedLatLng: LatLng;
  let selectedAddress: Address;

  // Component Setup
  function initMap(container: HTMLElement) {
    selectedLatLng = initialLocation ?? {
      lat: 39.5,
      lng: -98.34,
    };

    let startingZoom = initialLocation ? 12 : 4;

    leafletMap = Leaflet.map(container)
      .setView(selectedLatLng, startingZoom)
      .addLayer(
        Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          minZoom: 3,
          maxZoom: 16,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
      )
      .addControl(
        GeoSearchControl({
          provider: new OpenStreetMapProvider(),
          style: "bar",
          showMarker: false,
        })
      );

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
      selectedAddress = null;
    });

    leafletMap.on("geosearch/showlocation", (searchEvent: SearchEvent) => {
      placeMarker.setLatLng({
        lat: searchEvent.location.y,
        lng: searchEvent.location.x,
      });
      selectedAddress = parseAddressFromResult(searchEvent.location.label);
    });

    placeMarker.on("drag", (dragEvent) => {
      selectedLatLng = (dragEvent as Leaflet.LeafletMouseEvent).latlng;
      selectedAddress = null;
      placeInfoControl.setDisplayedCoordinates(selectedLatLng);
    });

    return {
      destroy: () => {
        leafletMap?.remove();
      },
    };
  }

  // Component Functions
  function parseAddressFromResult(result: string) {
    const addressComponents = result.split(",").map((str) => str.trim());
    if (addressComponents.length < 6) {
      return {
        address1: "",
        city: "",
        state: "",
        zipcode: "",
      };
    }

    // Parse Assumed Address Format Backwards: [Name]? [Building #]? [Road] [City] [County] [State] [Zipcode] [Country]

    // Remove the Country
    addressComponents.pop();

    const zipcode = addressComponents.pop();
    const state = addressComponents.pop();

    // Remove the County
    addressComponents.pop();

    const city = addressComponents.pop();

    let address1 = addressComponents.pop();
    if (addressComponents.length) {
      let houseNumber = addressComponents.pop();
      if (parseInt(houseNumber)) {
        address1 = `${houseNumber} ${address1}`;
      }
    }

    return {
      address1,
      city,
      state,
      zipcode,
    };
  }

  async function pickPlace() {
    if (selectedAddress) {
      onLocationSelected(selectedAddress, selectedLatLng);
      open = false;
    } else {
      try {
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({
          query: `${selectedLatLng.lat},${selectedLatLng.lng}`,
        });

        if (results.length) {
          selectedAddress = parseAddressFromResult(results[0].label);
          onLocationSelected(selectedAddress, selectedLatLng);
          open = false;
        } else {
          showToast({
            message: "No results were found. Please try again.",
            type: "error",
          });
        }
      } catch {
        showToast({
          message: "Something went wrong. Please try again.",
          type: "error",
        });
      }
    }
  }

  function reset() {
    selectedLatLng = null;
    selectedAddress = null;
  }
</script>

<Modal title="Choose Location" size="xl" bind:open on:hide={reset}>
  <div
    class="h-[50vh] w-[80vw] md:w-[700px] lg:w-[900px] xl:w-[1200px]"
    use:initMap
  />
  <div slot="footer" class="flex gap-2">
    <Button color="primary" disabled={!selectedLatLng} on:click={pickPlace}>
      <span class="font-bold">Choose Location</span>
    </Button>
    <Button color="alternative" on:click={() => (open = false)}>
      <span class="font-bold">Close</span>
    </Button>
  </div>
</Modal>
