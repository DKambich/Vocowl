<script lang="ts">
  import { Spinner } from "flowbite-svelte";
  import { Vocowl } from "../components";
</script>

<div
  class="h-screen w-screen bg-white dark:bg-gray-800 flex flex-col justify-center items-center text-indigo-600 dark:text-white"
>
  <div class="mb-4 ">
    <Vocowl size={64} />
  </div>
  <Spinner color="purple" />
</div>
