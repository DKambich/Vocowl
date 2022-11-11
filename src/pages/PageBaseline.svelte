<script lang="ts">
  import Header from "../lib/Header.svelte";
</script>

<div class="min-h-screen">
  <Header />
  <div class="container mx-auto lg:px-4">
    <slot />
  </div>
</div>
