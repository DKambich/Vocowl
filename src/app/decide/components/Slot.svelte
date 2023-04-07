<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Restaurant } from "../../../types";

  // Type Definitions
  interface SlotOptions {
    animationLength: number;
    maxReelItems: number;
  }

  // External Variables
  export let slotOptions: SlotOptions = {
    animationLength: 5000,
    maxReelItems: 40,
  };
  export let reelItems: Restaurant[] = [];
  export let reelItemBuilder = (reelItem: Restaurant) => `${reelItem}`;
  export let onReelStart = () => {};
  export let onReelEnd = (_: Restaurant) => {};

  // Component Variables
  let slotRef: HTMLElement;
  let itemHeight = 0;
  let reelAnimation: Animation;

  let shuffledReelItems: Restaurant[] = [];
  let isSpinning = false;
  let hasSpun = false;

  // Component Setup
  onMount(() => {
    slotRef = document.getElementById("slot");
    itemHeight = slotRef.clientHeight / 3;
    initializeSlot(slotRef, reelItems);
  });

  onDestroy(() => {
    reelAnimation?.cancel();
  });

  // Component Functions
  function shuffleArray(a: any[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function onResize() {
    itemHeight = slotRef.clientHeight / 3;
  }

  function initializeSlot(slotRef: HTMLElement, options: Restaurant[]) {
    // Only initialize if there are reel options
    if (options.length === 0) return;

    // Reset the top of the slot reel
    slotRef.style.top = `${0}px`;

    // Shuffle initial reel items
    shuffledReelItems = shuffleArray([...options]);

    // Fill shuffledReelItems up to maxReelItems
    while (shuffledReelItems.length < slotOptions.maxReelItems) {
      shuffledReelItems = [...shuffledReelItems, ...shuffledReelItems];
    }
    shuffledReelItems = shuffledReelItems.slice(0, slotOptions.maxReelItems);
  }

  export function updateReelOptions(reelItems: Restaurant[]) {
    initializeSlot(slotRef, reelItems);
  }

  export function startReel() {
    // Prevent a new spin if already spinning
    if (isSpinning) return;
    isSpinning = true;

    onReelStart();

    // Re-initialize slot if it has been spun
    if (hasSpun) initializeSlot(slotRef, reelItems);

    // Select the reel item and corresponding HTML div
    let winningItem = shuffledReelItems[shuffledReelItems.length - 2];
    let selectedReelItem = slotRef.children[
      shuffledReelItems.length - 3
    ] as HTMLElement;

    // Create and start the animation
    const animationOffset = `${-selectedReelItem.offsetTop}px`;
    reelAnimation = slotRef.animate(
      { transform: `translate(0, ${animationOffset})` },
      {
        duration: slotOptions.animationLength,
        easing: "ease-in-out",
        iterations: 1,
      }
    );

    reelAnimation.finished.then(() => {
      slotRef.style.top = animationOffset;
      hasSpun = true;
      isSpinning = false;
      onReelEnd(winningItem);
    });
  }
</script>

<svelte:window on:resize={onResize} />
<div
  class="relative h-full w-full overflow-hidden rounded-lg shadow-inner shadow-black dark:shadow-gray-500"
>
  <!-- Slot Triangle Pointers -->
  <div
    class="top-1/2 -translate-y-[15px] absolute left-0 w-0 h-0 border-l-[25px] border-primary-700 border-y-[15px] border-y-transparent z-10"
  />
  <div
    class="top-1/2 -translate-y-[15px] absolute right-0 w-0 h-0 border-r-[25px] border-primary-700 border-y-[15px] border-y-transparent z-10"
  />

  <!-- Slot Items -->
  <div id="slot" class="w-full h-full absolute text-center">
    {#each shuffledReelItems as option}
      <div
        class="text-xl md:text-2xl xl:text-3xl flex justify-center items-center overflow-hidden text-ellipsis dark:text-white border-t border-black dark:border-gray-600"
        style={`height: ${itemHeight}px; max-height: ${itemHeight}px;`}
      >
        {reelItemBuilder(option)}
      </div>
    {/each}
  </div>
</div>
