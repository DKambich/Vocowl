<script lang="ts">
  import {
    Button,
    Checkbox,
    Helper,
    Input,
    Label,
    Select,
  } from "flowbite-svelte";
  import { getContext } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import { MapPin } from "svelte-heros-v2";
  import { fade } from "svelte/transition";
  import { GEOCODE_SERVICE, US_STATES } from "../../../constants";
  import type { IGeocodingService } from "../../../services/IGeocodingService";
  import { addRestaurant } from "../../../stores/localStorageStore";
  import { showToast } from "../../../stores/toastStore";
  import type {
    Address,
    LatLng,
    ManualPlaceFormErrors,
    ManualPlaceFormValues,
    Restaurant,
  } from "../../../types";
  import { GUID } from "../../../utilities";
  import { PlacePickerModal } from "../../shared";

  // Type Definitions
  // External Variables
  export let userLocation: LatLng;

  // Component Variables
  const geocodeService = getContext<IGeocodingService>(GEOCODE_SERVICE);
  const states = US_STATES.map((state) => ({
    value: state.abbreviation,
    name: state.name,
  }));

  let showPlacePicker = false;
  let useAddressInput = false;
  const formValues: ManualPlaceFormValues = {
    restaurant: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
  };
  const { errors, handleChange, handleSubmit, updateField } = createForm({
    initialValues: formValues,
    validate: validateForm,
    onSubmit: submitForm,
  });

  // Component Functions
  function toggleAddressInput() {
    useAddressInput = !useAddressInput;
    $errors.address1 = "";
    $errors.city = "";
    $errors.state = "";
    $errors.zipcode = "";
  }

  function validateForm(values: ManualPlaceFormValues) {
    let errors: ManualPlaceFormErrors = {};
    if (values.restaurant === "") {
      errors.restaurant = "Restaurant is required";
    }
    if (useAddressInput) {
      if (values.address1 === "") {
        errors.address1 = "Address is required";
      }
      if (values.city === "") {
        errors.city = "City is required";
      }
      if (values.state === "") {
        errors.state = "State is required";
      }
      if (values.zipcode === "") {
        errors.zipcode = "Zipcode is required";
      }
    }
    return errors;
  }

  async function submitForm({
    restaurant,
    address1,
    address2,
    city,
    state,
    zipcode,
  }: ManualPlaceFormValues) {
    const customRestaurant: Restaurant = {
      name: restaurant,
      id: GUID(),
      source: "custom",
    };

    // Geocode the address if entered
    if (useAddressInput) {
      const address = { address1, address2, city, state, zipcode };
      customRestaurant.address = address;

      const [location, error] = await geocodeService.getLocationFromAddress(
        address
      );
      if (!error) {
        customRestaurant.location = location;
      }
    }

    formValues.restaurant = "";
    formValues.address1 = "";
    formValues.address2 = "";
    formValues.city = "";
    formValues.state = "";
    formValues.zipcode = "";

    addRestaurant(customRestaurant);
    showToast({
      message: `Added ${restaurant}`,
      type: "success",
      timeout: 2000,
    });
  }

  function handleLocatedAddress(address: Address, _: LatLng) {
    formValues.address1 = address.address1;
    updateField("address1", address.address1);

    formValues.address2 = address.address2;
    updateField("address2", address.address2);

    formValues.city = address.city;
    updateField("city", address.city);

    const selectedState = states.find((state) => state.name === address.state);
    formValues.state = selectedState?.value;
    updateField("state", selectedState?.value);

    formValues.zipcode = address.zipcode;
    updateField("zipcode", address.zipcode);
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="flex flex-col">
  <div class="mb-6">
    <Label for="restaurant" class="mb-2">
      Restaurant <span class="text-red-600 font-bold">*</span>
    </Label>
    <Input
      id="restaurant"
      name="restaurant"
      placeholder=""
      type="text"
      bind:value={formValues.restaurant}
      on:change={handleChange}
    />
    {#if $errors.restaurant}
      <Helper class="mt-2" color="red">
        {$errors.restaurant}
      </Helper>
    {/if}
  </div>
  <div class="mb-6">
    <Checkbox checked={useAddressInput} on:click={toggleAddressInput}>
      Add an Address
    </Checkbox>
  </div>
  {#if useAddressInput}
    <div class="grid gap-6 mb-6 md:grid-cols-2" transition:fade>
      <div>
        <Label for="address1" class="mb-2">
          Address Line 1 <span class="text-red-600 font-bold">*</span>
        </Label>
        <Input
          id="address1"
          name="address1"
          type="text"
          bind:value={formValues.address1}
          on:change={handleChange}
        />
        {#if $errors.address1}
          <Helper class="mt-2" color="red">
            {$errors.address1}
          </Helper>
        {/if}
      </div>
      <div>
        <Label for="address2" class="mb-2">Address Line 2</Label>
        <Input
          id="address2"
          name="address2"
          type="text"
          bind:value={formValues.address2}
          on:change={handleChange}
        />
      </div>
      <div>
        <Label for="city" class="mb-2">
          City <span class="text-red-600 font-bold">*</span>
        </Label>
        <Input
          id="city"
          name="city"
          type="text"
          bind:value={formValues.city}
          on:change={handleChange}
        />
        {#if $errors.city}
          <Helper class="mt-2" color="red">
            {$errors.city}
          </Helper>
        {/if}
      </div>
      <div>
        <Label for="state" class="mb-2">
          State <span class="text-red-600 font-bold">*</span>
        </Label>
        <Select
          id="state"
          name="state"
          placeholder="Choose a State..."
          items={states}
          bind:value={formValues.state}
          on:change={handleChange}
        />
        {#if $errors.state}
          <Helper class="mt-2" color="red">
            {$errors.state}
          </Helper>
        {/if}
      </div>
      <div>
        <Label for="zipcode" class="mb-2">
          Zipcode <span class="text-red-600 font-bold">*</span>
        </Label>
        <Input
          id="zipcode"
          name="zipcode"
          type="text"
          bind:value={formValues.zipcode}
          on:change={handleChange}
        />
        {#if $errors.zipcode}
          <Helper class="mt-2" color="red">
            {$errors.zipcode}
          </Helper>
        {/if}
      </div>
      <div>
        <Label class="mb-2 opacity-0 hidden md:block">Hidden</Label>
        <Button
          color="primary"
          class="w-full "
          on:click={() => (showPlacePicker = true)}
        >
          <MapPin class="mr-1" />
          <span class="font-bold">Locate Address</span>
        </Button>
      </div>
    </div>
  {/if}

  <Button color="primary" type="submit">
    <span class="font-bold">Submit</span>
  </Button>

  <PlacePickerModal
    initialLocation={userLocation}
    onLocationSelected={handleLocatedAddress}
    bind:open={showPlacePicker}
  />
</form>
