<script lang="ts">
  import { Header, ToastManager } from "../shared";
</script>

<div class="min-h-screen flex flex-col">
  <Header />
  <div class="flex-1 flex flex-col container mx-auto p-4">
    <slot />
  </div>
  <ToastManager />
</div>
