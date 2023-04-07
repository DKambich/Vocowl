<script lang="ts">
  import Router from "svelte-spa-router";
  import { Error, Loading, ResourceLoader } from "./app/meta";
  import { routes } from "./routes";
</script>

<ResourceLoader>
  <Loading slot="loading" />
  <Router slot="success" {routes} />
  <Error slot="failure" />
</ResourceLoader>
