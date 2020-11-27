<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <header>{{ title }}</header>
    </v-app-bar>

    <v-main>
      <module-list :modules="modules" />
    </v-main>
  </v-app>
</template>

<script>
  import ModuleList from "./components/ModuleList";
  import axios from "axios";
  import options from "../data/options.json";

  export default {
    name: "App",

    components: {
      ModuleList
    },

    data: () => ({
      modules: [],
      title: options.title
    }),

    mounted() {
      if (process.env.VUE_APP_DEV) {
        import("../data/modules.json").then(response => {
          this.modules = response.default;
        });
      } else {
        axios.get(options.dataUrl).then(response => {
          this.modules = response.data;
        });
      }
    }
  };
</script>

<style lang="scss">
@import "./util/parseScssData.js";

$titleLength: str-length(
  $string: $title,
);

.v-main {
  background-color: var(--v-secondary-base);
}

.v-toolbar__content {
  justify-content: center;

  & header {
    font-family: "Texturina", serif;
    font-size: xx-large;
    margin-top: -0.3em;
    color: lightgray;
  }
}

@media (max-width: $titleLength * 20px) {
  .v-toolbar__content header {
    font-size: x-large;
  }
}

@media (max-width: $titleLength * 14.7px) {
  .v-toolbar__content header {
    font-size: larger;
    text-align: center;
  }
}
</style>
