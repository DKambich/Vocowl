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
  // External LatLng of the user's location
  let userLocation = $localStorage.location.latlng;
  export let open = false;

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

  // Internal state variables
  const geocodingService = getContext<IGeocodingService>(GEOCODE_SERVICE);
  let verifiedZipcode = $localStorage.location.zipcode;
  $: userEnteredZipcode = verifiedZipcode;
  let zipcodeError = zipcodeErrors.NONE;
  let loadingGeolocation = false;
  let loadingZipcodeVerification = false;

  $: disableFields = loadingGeolocation || loadingZipcodeVerification;

  // Function to geolocate the user's location and zipcode
  function geolocateZipcode() {
    // Check if the device has geolocation available
    if (navigator.geolocation) {
      // Get the user's location
      loadingGeolocation = true;
      navigator.geolocation.getCurrentPosition(
        async (location) => {
          try {
            // Geocode the user's zipcode from their location
            userLocation = {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            };
            const zipcode = await geocodingService.getZipcodeFromLocation(
              userLocation
            );

            // If there is a zipcode
            if (zipcode) {
              // Update the modal
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
          } catch (e) {
            zipcodeError = zipcodeErrors.ERROR;
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

  // Function to verify the manually entered zipcode and set the location
  async function verifyandSetManualZipcode() {
    // Show an error if nothing is entered
    if (userEnteredZipcode.length === 0) {
      zipcodeError = zipcodeError = zipcodeErrors.INVALID;
      return;
    }

    loadingZipcodeVerification = true;
    try {
      // Geocode the user's location  from their zipcode
      const location = await geocodingService.getLocationFromZipcode(
        userEnteredZipcode
      );

      verifiedZipcode = userEnteredZipcode;

      // Store the user's location
      userLocation = {
        lat: location.lat,
        lng: location.lng,
      };

      // Cache the location
      cacheLocation(userLocation, verifiedZipcode);

      // Clear zipcode errors
      zipcodeError = zipcodeErrors.NONE;
      open = false;
    } catch (e) {
      zipcodeError = zipcodeErrors.ERROR;
    } finally {
      loadingZipcodeVerification = false;
    }
  }
</script>

<Modal title="Update Location" bind:open autoclose={false}>
  <div class="w-80">
    <Label for="input-zipcode">Zipcode</Label>
    <ButtonGroup class="w-full mt-1">
      <Input
        type="text"
        placeholder="Enter Zipcode..."
        bind:value={userEnteredZipcode}
        color={zipcodeError === zipcodeErrors.NONE ? "base" : "red"}
        disabled={disableFields}
        id="input-zipcode"
      />
      <Button
        on:click={geolocateZipcode}
        color="primary"
        disabled={disableFields}
      >
        {#if loadingGeolocation}
          <Spinner color="gray" size="6" />
        {:else}
          <MapPin />
        {/if}
      </Button>
      <Tooltip placement="bottom">Use My Location</Tooltip>
    </ButtonGroup>
    <!-- Error or Helper Text -->
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
            rel="noreferrer"
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
      on:click={verifyandSetManualZipcode}
      color="primary"
      disabled={disableFields}
    >
      {#if loadingZipcodeVerification}
        <Spinner color="gray" size="6" />
      {:else}
        Set Location
      {/if}
    </Button>
    <Button
      on:click={() => (open = false)}
      color="alternative"
      disabled={disableFields}
    >
      Close
    </Button>
  </svelte:fragment>
</Modal>
