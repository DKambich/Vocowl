<script lang="ts">
  import { Heading, P } from "flowbite-svelte";
  import { PageBaseline } from ".";
  import { Vocowl } from "../shared";
</script>

<PageBaseline>
  <div
    class="flex flex-col justify-center items-center text-center bg-white dark:bg-gray-800 text-primary-600 dark:text-white"
  >
    <div class="mb-4">
      <Vocowl size={128} />
    </div>
    <Heading class="mb-4">404 Not Found</Heading>
    <P size="xl">We couldn't find the page you were looking for...</P>
  </div>
</PageBaseline>
