<script lang="ts">
  import {
    Button,
    Helper,
    Input,
    Label,
    Select,
    Toggle,
  } from "flowbite-svelte";
  import { createForm } from "svelte-forms-lib";
  import { fade } from "svelte/transition";
  import { US_STATES } from "../../../constants";
  import { addRestaurant } from "../../../stores/localStorageStore";
  import { showToast } from "../../../stores/toastStore";
  import type {
    ManualPlaceFormErrors,
    ManualPlaceFormValues,
    Restaurant,
  } from "../../../types";
  import { GUID } from "../../../utilities";

  const states = US_STATES.map((state) => ({
    value: state.abbreviation,
    name: state.name,
  }));

  let useAddressInput = false;
  const formValues: ManualPlaceFormValues = {
    restaurant: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
  };

  const { errors, handleReset, handleChange, handleSubmit } = createForm({
    initialValues: formValues,
    validate: validateForm,
    onSubmit: submitForm,
  });

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
    }
    return errors;
  }

  function toggleAddressInput() {
    useAddressInput = !useAddressInput;
    $errors.address1 = "";
    $errors.city = "";
    $errors.state = "";
  }

  function submitForm({
    restaurant,
    address1,
    address2,
    city,
    state,
  }: ManualPlaceFormValues) {
    const customRestaurant: Restaurant = {
      name: restaurant,
      address: `${address1} ${address2}, ${city}, ${state}`,
      id: GUID(),
      source: "custom",
    };

    formValues.restaurant = "";
    formValues.address1 = "";
    formValues.address2 = "";
    formValues.city = "";
    formValues.state = "";

    addRestaurant(customRestaurant);
    showToast({
      message: `Added ${restaurant}`,
      type: "success",
      timeout: 2000,
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div class="mb-6">
    <Label for="restaurant" class="mb-2">
      Restaurant <span class="text-red-600 font-bold">*</span>
    </Label>
    <Input
      type="text"
      name="restaurant"
      id="restaurant"
      placeholder=""
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
    <Toggle checked={useAddressInput} on:click={toggleAddressInput}>
      Add an Address
    </Toggle>
  </div>
  {#if useAddressInput}
    <div class="grid gap-6 mb-6 md:grid-cols-2" transition:fade>
      <div>
        <Label for="address1" class="mb-2">
          Address Line 1 <span class="text-red-600 font-bold">*</span>
        </Label>
        <Input
          type="text"
          name="address1"
          id="address1"
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
          type="text"
          name="address2"
          id="address2"
          bind:value={formValues.address2}
          on:change={handleChange}
        />
      </div>
      <div>
        <Label for="city" class="mb-2">
          City <span class="text-red-600 font-bold">*</span>
        </Label>
        <Input
          type="text"
          name="city"
          id="city"
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
          name="state"
          id="state"
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
    </div>
  {/if}

  <Button type="submit" color="primary" class="w-full md:w-max"
    >Add Restaurant</Button
  >
</form>
