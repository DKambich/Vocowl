<script lang="ts">
  import { ResourceLoader } from "./components";

  import Router from "svelte-spa-router";
  import { routes } from "./routes";
  import { Error, Loading } from "./pages";
</script>

<ResourceLoader>
  <Loading slot="loading"  />
  <Router slot="success" {routes} />
  <Error slot="failure" />
</ResourceLoader>
