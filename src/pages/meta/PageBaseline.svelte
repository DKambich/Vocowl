<script lang="ts">
  import { Header } from "../../components";
  import ToastManager from "../../components/ToastManager.svelte";
</script>

<div class="min-h-screen flex flex-col">
  <Header />
  <div class="flex-1 flex flex-col container mx-auto px-4 pt-4">
    <slot />
  </div>
  <ToastManager />
</div>
