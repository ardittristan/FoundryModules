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
        <module :module="module" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Module from "./Module";

  export default {
    name: "ModuleList",

    components: {
      Module,
    },

    props: {
      modules: Array,
    },
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
    }
  }
</style>
