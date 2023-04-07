<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  type T = $$Generic;
  interface $$Events {
    reelEnd: CustomEvent<T>;
  }

  interface SlotOptions {
    animationLength: number;
    maxReelItems: number;
  }

  const defaultSlotOptions: SlotOptions = {
    animationLength: 5000,
    maxReelItems: 40,
  };

  // Props
  export let slotOptions = defaultSlotOptions;
  export let reelItems: T[] = [];
  export let reelItemBuilder = (reelItem: T) => `${reelItem}`;
  export let onReelStart = () => {};
  export let onReelEnd = (_: T) => {};

  // Local variables
  let slotRef: HTMLElement;
  let finalReelItems: T[] = [];
  let isSpinning = false;
  let hasSpun = false;
  let itemHeight = 0;
  let reelAnimation: Animation;

  onMount(() => {
    slotRef = document.getElementById("slot");
    itemHeight = slotRef.clientHeight / 3;
    initializeSlot(slotRef, reelItems);
  });

  onDestroy(() => {
    reelAnimation?.cancel();
  });

  export function updateReelOptions(reelItems: T[]) {
    initializeSlot(slotRef, reelItems);
  }

  function shuffleArray(a: any[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initializeSlot(slotRef: HTMLElement, options: T[]) {
    // Don't initialize if there are no options
    if (options.length === 0) return;

    // Reset the top of the slot reel
    slotRef.style.top = `${0}px`;

    // Shuffle initial items
    finalReelItems = shuffleArray([...options]);

    // Add to finalReelItems until it has maxReelItems
    while (finalReelItems.length < slotOptions.maxReelItems) {
      finalReelItems = [...finalReelItems, ...finalReelItems];
    }
    finalReelItems = finalReelItems.slice(0, slotOptions.maxReelItems);
  }

  export function startReel() {
    // Disallow a new spin if already spinning
    if (isSpinning) return;
    isSpinning = true;

    onReelStart();

    // Re-initialize slot if it has been spun
    if (hasSpun) initializeSlot(slotRef, reelItems);

    let winningReelItem = slotRef.children[
      finalReelItems.length - 3
    ] as HTMLElement;

    let winningItem = finalReelItems[finalReelItems.length - 2];

    const offsetAmount = `${-winningReelItem.offsetTop}px`;

    reelAnimation = slotRef.animate(
      { transform: `translate(0, ${offsetAmount})` },
      {
        duration: slotOptions.animationLength,
        easing: "ease-in-out",
        iterations: 1,
      }
    );

    reelAnimation.finished.then(() => {
      slotRef.style.top = offsetAmount;
      hasSpun = true;
      isSpinning = false;
      onReelEnd(winningItem);
    });
  }

  function resize() {
    itemHeight = slotRef.clientHeight / 3;
  }
</script>

<svelte:window on:resize={resize} />
<div
  class="relative h-full w-full overflow-hidden rounded-lg shadow-inner shadow-black dark:shadow-gray-500"
>
  <div
    class="top-1/2 -translate-y-[15px] absolute left-0 w-0 h-0 border-l-[25px] border-primary-700 border-y-[15px] border-y-transparent z-10"
  />
  <div
    class="top-1/2 -translate-y-[15px] absolute right-0 w-0 h-0 border-r-[25px] border-primary-700 border-y-[15px] border-y-transparent z-10"
  />
  <div id="slot" class="w-full h-full absolute text-center">
    {#each finalReelItems as option}
      <div
        class="text-xl md:text-2xl  xl:text-3xl flex justify-center items-center overflow-hidden text-ellipsis dark:text-white border-t border-black dark:border-gray-600"
        style={`height: ${itemHeight}px; max-height: ${itemHeight}px;`}
      >
        {reelItemBuilder(option)}
      </div>
    {/each}
  </div>
</div>