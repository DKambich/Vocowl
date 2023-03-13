<script lang="ts">
  import { ResourceLoader, Error, Loading } from "./app/meta";

  import Router from "svelte-spa-router";
  import { routes } from "./routes";
</script>

<ResourceLoader>
  <Loading slot="loading" />
  <Router slot="success" {routes} />
  <Error slot="failure" />
</ResourceLoader>
