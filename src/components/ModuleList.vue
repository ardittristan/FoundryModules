<template>
  <v-container>
    <v-row>
      <v-col
        v-for="module in modules"
        :key="module.name"
        class="module"
        cols="12"
        lg="4"
        md="6"
        sm="6"
      >
        <module
          :module="module"
          :dlcounts="dlCounts"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Module from "./Module";
  import axios from "axios";
  import options from "../../data/options.json";

  export default {
    name: "ModuleList",

    components: {
      Module
    },

    data: () => ({
      dlCounts: {}
    }),

    props: {
      modules: Array
    },

    mounted() {
      if (options.useActions)
        axios
          .get(
            `https://raw.githubusercontent.com/${options.repo}/download-api/downloads.json`
          )
          .then(response => {
            this.dlCounts = response.data;
          });
    }
  };
</script>

<style lang="scss" scoped>
.module {
  height: auto;

  & > .v-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--v-secondary-darken1);
    position: relative;
  }
}
</style>
