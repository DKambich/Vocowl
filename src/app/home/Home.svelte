<script lang="ts">
  import { Button, ButtonGroup, Heading, P } from "flowbite-svelte";
  import { MagnifyingGlass, Megaphone } from "svelte-heros-v2";
  import { DECIDE_ROUTE, RESTAURANT_ROUTE } from "../../constants";
  import { PageBaseline } from "../meta";
  import Vocowl from "../shared/Vocowl.svelte";
</script>

<PageBaseline>
  <div class="flex flex-col items-center text-center gap-4">
    <span class="text-primary-700 dark:text-white">
      <Vocowl size={256} />
    </span>
    <Heading
      tag="h1"
      class="mb-4"
      customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
    >
      Time To Be Vocowl
    </Heading>
    <ButtonGroup>
      <Button href={`#${RESTAURANT_ROUTE}`} color="primary" size="lg">
        <MagnifyingGlass size="18" class="mr-1" />
        <span class="font-bold"> Start Searching </span>
      </Button>
      <Button href={`#${DECIDE_ROUTE}`} color="alternative" size="lg">
        <Megaphone size="18" class="mr-1" />
        <span class="font-bold"> Start Deciding </span>
      </Button>
    </ButtonGroup>

    <P class="text-lg lg:text-xl xl:px-48 dark:text-gray-400">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Suscipit adipiscing
      bibendum est ultricies. Morbi enim nunc faucibus a pellentesque sit amet.
      Auctor urna nunc id cursus metus aliquam eleifend mi in. Aliquet lectus
      proin nibh nisl. Odio ut sem nulla pharetra diam sit. Gravida in fermentum
      et sollicitudin ac orci phasellus egestas. In nibh mauris cursus mattis
      molestie. Et tortor consequat id porta nibh. Dictum non consectetur a erat
      nam at lectus. Pellentesque eu tincidunt tortor aliquam nulla facilisi.
      Sed viverra tellus in hac habitasse platea dictumst vestibulum.
    </P>
    <P class="mb-6 text-lg lg:text-xl xl:px-48 dark:text-gray-400">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Suscipit adipiscing
      bibendum est ultricies. Morbi enim nunc faucibus a pellentesque sit amet.
      Auctor urna nunc id cursus metus aliquam eleifend mi in. Aliquet lectus
      proin nibh nisl. Odio ut sem nulla pharetra diam sit. Gravida in fermentum
      et sollicitudin ac orci phasellus egestas. In nibh mauris cursus mattis
      molestie. Et tortor consequat id porta nibh. Dictum non consectetur a erat
      nam at lectus. Pellentesque eu tincidunt tortor aliquam nulla facilisi.
      Sed viverra tellus in hac habitasse platea dictumst vestibulum.
    </P>
  </div>
</PageBaseline>
