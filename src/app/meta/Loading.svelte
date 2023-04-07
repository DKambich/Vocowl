<script lang="ts">
  import { Spinner } from "flowbite-svelte";
  import { Vocowl } from "../shared";
</script>

<div
  class="h-screen w-screen flex flex-col justify-center items-center bg-white dark:bg-gray-800 text-primary-600 dark:text-white"
>
  <div class="mb-4">
    <Vocowl size={64} />
  </div>
  <Spinner class="fill-primary-600" />
</div>
