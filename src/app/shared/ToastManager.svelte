<script lang="ts">
  import { Toast } from "flowbite-svelte";
  import {
    CheckCircle,
    ExclamationTriangle,
    InformationCircle,
    ShieldExclamation,
  } from "svelte-heros-v2";
  import { fade } from "svelte/transition";
  import { toasts } from "../../stores/toastStore";

  function getIcon(type: string) {
    if (type === "success") return CheckCircle;
    if (type === "warning") return ExclamationTriangle;
    if (type === "error") return ShieldExclamation;
    return InformationCircle;
  }

  function getColor(type: string) {
    if (type === "success") return "green";
    if (type === "warning") return "yellow";
    if (type === "error") return "red";
    return "indigo";
  }
</script>

<div
  class="fixed bottom-0 right-0 flex flex-col-reverse items-end gap-y-2 pb-2 pr-2 lg:pb-8 lg:pr-8 w-screen "
>
  {#each $toasts as toast (toast.id)}
    <Toast
      simple
      color={getColor(toast.type)}
      transition={fade}
      params={{ duration: 150 }}
      divClass="w-full max-w-xs md:max-w-lg p-4"
    >
      <svelte:component this={getIcon(toast.type)} slot="icon" />
      <span class="font-semibold"> {toast.message} </span>
    </Toast>
  {/each}
</div>
