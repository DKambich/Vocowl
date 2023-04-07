<script lang="ts">
  import { Button, ButtonGroup, Heading, P, Span } from "flowbite-svelte";
  import { MagnifyingGlass, Megaphone } from "svelte-heros-v2";
  import { DECIDE_ROUTE, RESTAURANT_ROUTE } from "../../constants";
  import { PageBaseline } from "../meta";
  import { Vocowl } from "../shared";
</script>

<PageBaseline>
  <div class="flex flex-col items-center gap-4 text-center">
    <span class="text-primary-700 dark:text-white">
      <Vocowl size={256} />
    </span>
    <Heading
      class="mb-4"
      customSize="text-4xl font-extrabold md:text-5xl lg:text-6xl"
    >
      Time To Be Vocowl
    </Heading>
    <ButtonGroup>
      <Button href={`#${RESTAURANT_ROUTE}`} color="primary" size="lg">
        <MagnifyingGlass size="18" class="mr-1" />
        <span class="font-bold">Start Searching</span>
      </Button>
      <Button href={`#${DECIDE_ROUTE}`} color="alternative" size="lg">
        <Megaphone size="18" class="mr-1" />
        <span class="font-bold">Start Deciding</span>
      </Button>
    </ButtonGroup>
    <Span italic>When in doubt, let Vocowl pick it out</Span>
    <P class="text-lg lg:text-xl xl:px-48 my-2">
      Welcome to Vocowl, the perfect solution for those who struggle with making
      food decisions. Do you find yourself constantly asking, "Where should I
      eat?" or feeling overwhelmed by all the restaurant options around you? If
      so, Vocowl is here to help.
    </P>
    <P class="text-lg lg:text-xl xl:px-48 my-2">
      The idea was born out of a simple question: "How do I pick where to eat?"
      Decision-making can be a challenge, especially when it comes to food.
      That's why Vocowl was built; to help you easily select nearby restaurants
      and even add your own favorites.
    </P>
    <P class="text-lg lg:text-xl xl:px-48 my-2">
      As the name suggests, Vocowl pays homage to the wisdom of owls. Just as
      these wise creatures have a reputation for making sound decisions, Vocowl
      can help you do the same when it comes to food. So sit back, relax, and
      let Vocowl choose your next dining destination.
    </P>
  </div>
</PageBaseline>
