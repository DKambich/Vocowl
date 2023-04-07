<script lang="ts">
  import {
    Button,
    ButtonGroup,
    Helper,
    Input,
    Label,
    Modal,
    Spinner,
    Tooltip,
  } from "flowbite-svelte";
  import { getContext } from "svelte";
  import { MapPin } from "svelte-heros-v2";
  import { GEOCODE_SERVICE } from "../../constants";
  import type { IGeocodingService } from "../../services/IGeocodingService";
  import { cacheLocation, localStorage } from "../../stores/localStorageStore";

  // Type Definitions
  // External Variables
  export let open = false;

  // Component Variables
  const geocodingService = getContext<IGeocodingService>(GEOCODE_SERVICE);
  let userLocation = $localStorage.location.latlng;
  let verifiedZipcode = $localStorage.location.zipcode;

  // Dictionary of geolocation error messages
  const zipcodeErrors = {
    DENIED:
      "Location service permissions were denied. Please re-enable or enter your zipcode manually.",
    UNAVAILABLE:
      "Location service could not retrieve your location. Please try again or enter your zipcode manually.",
    TIMEOUT:
      "Location service timed out retrieving your location. Please try again or enter your zipcode manually.",
    HARDWARE:
      "Location service is not available on this device. Please enter your zipcode manually.",
    UNKNOWN:
      "Location service could not identify your location. Please enter your zipcode manually.",
    INVALID:
      "Location service could not identify your location. Please enter a valid zipcode.",
    ERROR: "Location service encountered an error. Please try again.",
    NONE: "",
  };

  let zipcodeError = zipcodeErrors.NONE;
  let loadingGeolocation = false;
  let loadingZipcodeVerification = false;

  // State Subscription
  $: userEnteredZipcode = verifiedZipcode;
  $: disableFields = loadingGeolocation || loadingZipcodeVerification;

  // Component Functions
  function geolocateZipcode() {
    // Check if geolocation is available
    if (navigator.geolocation) {
      loadingGeolocation = true;
      navigator.geolocation.getCurrentPosition(
        async (location) => {
          userLocation = {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };

          // Geocode the user's zipcode from their location
          const [zipcode, error] =
            await geocodingService.getZipcodeFromLocation(userLocation);

          if (error) {
            zipcodeError = zipcodeErrors.ERROR;
          } else {
            if (zipcode) {
              verifiedZipcode = zipcode;

              // Cache the user's location
              cacheLocation(userLocation, zipcode);

              // Clear zipcode errors
              zipcodeError = zipcodeErrors.NONE;
              loadingGeolocation = false;
              open = false;
            } else {
              zipcodeError = zipcodeErrors.UNKNOWN;
            }
          }
        },
        (error) => {
          loadingGeolocation = false;
          switch (error.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
              zipcodeError = zipcodeErrors.DENIED;
              break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
              zipcodeError = zipcodeErrors.UNAVAILABLE;
              break;
            case GeolocationPositionError.TIMEOUT:
              zipcodeError = zipcodeErrors.TIMEOUT;
              break;
          }
        },
        { enableHighAccuracy: false }
      );
    } else {
      zipcodeError = zipcodeErrors.HARDWARE;
    }
  }

  async function verifyandSetManualZipcode() {
    // Show an error if no query is entered
    if (userEnteredZipcode.length === 0) {
      zipcodeError = zipcodeError = zipcodeErrors.INVALID;
      return;
    }

    loadingZipcodeVerification = true;

    // Geocode the user's location  from their zipcode
    const [location, error] = await geocodingService.getLocationFromZipcode(
      userEnteredZipcode
    );

    if (error) {
      zipcodeError = zipcodeErrors.ERROR;
    } else {
      verifiedZipcode = userEnteredZipcode;

      userLocation = {
        lat: location.lat,
        lng: location.lng,
      };

      // Cache the location
      cacheLocation(userLocation, verifiedZipcode);

      // Clear zipcode errors
      zipcodeError = zipcodeErrors.NONE;
      open = false;
    }
    loadingZipcodeVerification = false;
  }
</script>

<Modal title="Update Location" autoclose={false} bind:open>
  <div class="w-[80vw] md:w-80">
    <Label for="input-zipcode">Zipcode</Label>
    <ButtonGroup class="w-full mt-1">
      <Input
        id="input-zipcode"
        color={zipcodeError === zipcodeErrors.NONE ? "base" : "red"}
        disabled={disableFields}
        placeholder="Enter Zipcode..."
        type="text"
        bind:value={userEnteredZipcode}
      />
      <Button
        color="primary"
        disabled={disableFields}
        on:click={geolocateZipcode}
      >
        {#if loadingGeolocation}
          <Spinner color="gray" size="6" />
        {:else}
          <MapPin />
        {/if}
      </Button>
      <Tooltip placement="bottom">Use My Location</Tooltip>
    </ButtonGroup>
    <Helper
      class="mt-2"
      color={zipcodeError === zipcodeErrors.NONE ? "gray" : "red"}
    >
      <span class="font-bold">
        {#if zipcodeError !== zipcodeErrors.NONE}
          {zipcodeError}
        {:else if verifiedZipcode}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${verifiedZipcode}`}
            target="_blank"
            class="underline"
          >
            Currently using {verifiedZipcode}
          </a>
        {:else}
          No zipcode is selected
        {/if}
      </span>
    </Helper>
  </div>
  <svelte:fragment slot="footer">
    <Button
      color="primary"
      disabled={disableFields}
      on:click={verifyandSetManualZipcode}
    >
      {#if loadingZipcodeVerification}
        <Spinner color="gray" size="6" />
      {:else}
        <span class="font-bold">Set Location</span>
      {/if}
    </Button>
    <Button
      color="alternative"
      disabled={disableFields}
      on:click={() => (open = false)}
    >
      <span class="font-bold">Close</span>
    </Button>
  </svelte:fragment>
</Modal>
