<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <header>Ardittristan's Foundry VTT Modules</header>
    </v-app-bar>

    <v-main>
      <module-list :modules="modules" />
    </v-main>
  </v-app>
</template>

<script>
  import ModuleList from "./components/ModuleList";
  import axios from "axios";

  export default {
    name: "App",

    components: {
      ModuleList,
    },

    data: () => ({
      modules: [],
    }),

    mounted() {
      if (process.env.VUE_APP_DEV) {
        import("../data/modules.json").then((response) => {
          this.modules = response.default;
        });
      } else {
        axios
          .get(
            "https://raw.githubusercontent.com/ardittristan/FoundryModules/master/data/modules.json"
          )
          .then((response) => {
            this.modules = response.data;
          });
      }
    },
  };
</script>

<style lang="scss">
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

@media (max-width: 600px) {
  .v-toolbar__content header {
    font-size: x-large;
  }
}

@media (max-width: 440px) {
  .v-toolbar__content header {
    font-size: larger;
    text-align: center;
  }
}
</style>
