<script lang="ts">
  import { Header } from "../components";
  import ToastManager from "../components/ToastManager.svelte";
</script>

<div class="min-h-screen">
  <Header />
  <div class="container mx-auto lg:px-4">
    <slot />
  </div>
  <ToastManager />
</div>
