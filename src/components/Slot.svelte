<script lang="ts">
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  type T = $$Generic;
  interface $$Events {
    reelEnd: CustomEvent<T>;
  }

  export let options: T[] = [];
  export let optionBuilder: (reelItem: T) => String = (reelItem) =>
    `${reelItem}`;
  export const startReel = spinReel;
  export let onReelEnd = (_: T) => {};

  const dispatch = createEventDispatcher();

  let slotRef: HTMLElement;
  const REEL_LENGTH = 30;
  let slotOptions: T[] = [];
  let isSpinning = false;
  let hasSpun = false;

  onMount(() => {
    slotRef = document.getElementById("slot");
    initializeSlot(slotRef, options);
  });

  function shuffleArray(a: any[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initializeSlot(slotRef: HTMLElement, options: T[]) {
    // TODO: Show Error?
    if (options.length === 0) return;

    // Reset the top of the slot reel
    slotRef.style.top = `${0}px`;

    // Shuffle initial items
    slotOptions = shuffleArray([...options]);

    // Select the first MIN_SLOT_LENGTH elements
    if (slotOptions.length > REEL_LENGTH) {
      slotOptions = slotOptions.slice(0, REEL_LENGTH);
    }

    // Populate slotOptions with random options up to MIN_SLOT_LENGTH items
    while (slotOptions.length < REEL_LENGTH) {
      const randomIndex = Math.floor(Math.random() * options.length);
      slotOptions.push(options[randomIndex]);
    }
  }

  function spinReel() {
    // Disallow a new spin if already spinning
    if (isSpinning) return;
    isSpinning = true;

    // Re-initialize slot if it has been spun
    if (hasSpun) initializeSlot(slotRef, options);

    let winningReelItem = slotRef.children[
      slotOptions.length - 3
    ] as HTMLElement;

    let winningItem = slotOptions[slotOptions.length - 2];

    const offsetAmount = `${-winningReelItem.offsetTop}px`;

    const reelAnimation = slotRef.animate(
      { transform: `translate(0, ${offsetAmount})` },
      {
        duration: 4000,
        iterations: 1,
        easing: "ease-in-out",
      }
    );

    reelAnimation.finished.then(() => {
      slotRef.style.top = offsetAmount;
      hasSpun = true;
      isSpinning = false;

      onReelEnd(winningItem);
    });
  }
</script>

<div class="slotCtr">
  <div class="slot">
    <div id="slot" class="slotInner">
      {#each slotOptions as option}
        <div class="option">
          {optionBuilder(option)}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .slotCtr {
    position: relative;
    overflow: hidden;
    height: 600px;
    width: 100%;
    box-shadow: inset 0 35px 45px -35px rgba(0, 0, 0, 0.7),
      inset 0 -35px 45px -35px rgba(0, 0, 0, 0.7);
    border-radius: 25px;
  }

  .slotInner {
    height: 100%;
    position: absolute;
    text-align: center;
    width: 100%;
  }
  .option {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    height: 200px;
    border-top: 1px rgba(0, 0, 0, 0.2) solid;
  }
</style>
