<script lang="ts">
  import { Button, ButtonGroup, Heading, P, Span } from "flowbite-svelte";
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
    <Span italic>When in doubt, let Vocowl pick it out.</Span>
    <P class="text-lg lg:text-xl xl:px-48 ">
      Welcome to Vocowl, the perfect solution for those who struggle with making
      food decisions. Do you find yourself constantly asking, "Where should I
      eat?" or feeling overwhelmed by all the restaurant options around you? If
      so, Vocowl is here to help.
    </P>
    <P class="text-lg lg:text-xl xl:px-48">
      The idea was born out of a simple question: "How do I pick where to eat?"
      We understand that decision-making can be a challenge, especially when it
      comes to food. That's why we built Vocowl; to help you easily select
      nearby restaurants and even add your own favorites.
    </P>
    <P class="text-lg lg:text-xl xl:px-48">
      As our name suggests, we pay homage to the wisdom of owls. Just as these
      wise creatures have a reputation for making sound decisions, we believe
      that Vocowl can help you do the same when it comes to food. So sit back,
      relax, and let Vocowl choose your next dining destination.
    </P>
  </div>
</PageBaseline>
