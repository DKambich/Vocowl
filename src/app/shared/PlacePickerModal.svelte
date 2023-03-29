<script lang="ts">
  import { Button, Modal } from "flowbite-svelte";
  import * as Leaflet from "leaflet";
  import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
  import type { Address, LatLng } from "../../types";

  export let initialLocation: LatLng;
  export let open = true;
  export let onLocationSelected = (address: Address, location: LatLng) => {};

  let leafletMap: Leaflet.Map;
  let placeMarker: Leaflet.Marker;
  let placeInfoControl: Leaflet.Control & {
    setDisplayedCoordinates: (coords: LatLng) => void;
  };

  let selectedLatLng: LatLng;
  let selectedAddress: Address;

  function parseAddressFromLabel(label: string) {
    const addressComponents = label.split(",").map((str) => str.trim());
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
      if (parseInt(houseNumber)) address1 = `${houseNumber} ${address1}`;
    }

    return {
      address1,
      city,
      state,
      zipcode,
    };
  }

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

  type SearchEvent = Leaflet.LeafletEvent & {
    location: {
      x: number;
      y: number;
      label: string;
      bounds: number[][];
    };
  };

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
      selectedAddress = null;
    });

    placeMarker.on("drag", (dragEvent) => {
      selectedLatLng = (dragEvent as Leaflet.LeafletMouseEvent).latlng;
      placeInfoControl.setDisplayedCoordinates(selectedLatLng);
      selectedAddress = null;
    });

    const searchControl = GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: "bar",
      showMarker: false,
    });
    leafletMap.on("geosearch/showlocation", (searchEvent: SearchEvent) => {
      console.log(searchEvent);
      let location: LatLng = {
        lat: searchEvent.location.y,
        lng: searchEvent.location.x,
      };
      placeMarker.setLatLng(location);
      selectedAddress = parseAddressFromLabel(searchEvent.location.label);
    });

    leafletMap.addControl(searchControl);

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
    if (selectedAddress) {
      console.log("Valid");
      onLocationSelected(selectedAddress, selectedLatLng);
      open = false;
    } else {
      try {
        console.log("Trying to Search");
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({
          query: `${selectedLatLng.lat},${selectedLatLng.lng}`,
        });

        if (results.length) {
          selectedAddress = parseAddressFromLabel(results[0].label);
          console.log("Worked");
          onLocationSelected(selectedAddress, selectedLatLng);
          open = false;
        } else {
          // TODO: Handle error
        }
      } catch {
        // TODO: Handle error
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
    class="w-[80vw] md:w-[700px] lg:w-[900px] xl:w-[1200px] h-[50vh]"
    use:mapAction
  />
  <div slot="footer" class="font-bold">
    <Button color="primary" on:click={pickPlace} disabled={!selectedLatLng}>
      <span class="font-bold">Choose Location</span>
    </Button>
    <Button color="alternative" on:click={() => (open = false)}>
      <span class="font-bold">Close</span>
    </Button>
  </div>
</Modal>
