<template>
  <v-card
    :ripple="false"
    elevation="2"
  >
    <div
      v-if="module.deprecated"
      class="deprecated"
    >
      <span>
        deprecated
      </span>
    </div>
    <header>
      <v-card-title>
        <a
          :href="manifest.url"
          target="_blank"
        >{{ manifest.title }}</a>
      </v-card-title>

      <v-lazy v-model="dlVisible">
        <v-tooltip
          v-if="dlVisible"
          bottom
        >
          <template #activator="{ on, attrs }">
            <v-chip
              v-bind="attrs"
              @click="copyManifest"
              v-on="on"
            >
              <v-icon
                size="1.5em"
                left
              >
                mdi-download
              </v-icon>
              <count-to
                :start-val="0"
                :end-val="downloadCount"
                :duration="5000"
              />
            </v-chip>
          </template>
          <span>Click to copy manifest url</span>
        </v-tooltip>
      </v-lazy>
    </header>
    <main>
      <v-card-text>
        {{ description }}
      </v-card-text>
    </main>
    <footer>
      <v-card-text>
        <v-chip
          v-for="language in languages"
          :key="language"
          class="languageChip"
          small
        >
          <v-icon
            size="1.5em"
            left
          >
            mdi-translate
          </v-icon>
          {{ language }}
        </v-chip>
      </v-card-text>
    </footer>

    <v-alert
      class="copyAlert"
      :value="copyAlert"
      dense
      elevation="4"
      type="success"
      transition="scale-transition"
    >
      <span>
        Manifest Url Copied
      </span>
    </v-alert>
  </v-card>
</template>

<script>
  import axios from "axios";
  import each from "async-each";
  import CountTo from "vue-count-to";

  export default {
    name: "Module",

    components: {
      CountTo
    },

    props: {
      module: Object,
    },

    data: () => ({
      manifest: {},
      downloadCount: 0,
      languages: [],
      copyAlert: false,
      dlVisible: false,
    }),

    computed: {
      description() {
        return this.module.description || this.manifest.description;
      }
    },

    mounted() {
      axios.get(this.module.manifest).then((response) => {
        this.manifest = response.data;

        const languages = [];
        each(
          this.manifest.languages || [],
          async (language, next) => {
            const languageTag = (
              await import("../util/languages")
            ).getLanguageByTag(language);
            if (!languages.includes(languageTag)) {
              languages.push(languageTag);
            }
            next();
          },
          () => {
            this.languages = languages;
          }
        );
      });

      import("gh-releases-stats").then((module) => {
        module.default.total(this.module.repository, (_err, count) => {
          this.downloadCount = count;
        })
      })
    },

    methods: {
      copyManifest() {
        const listener = (ev) => {
          ev.preventDefault();
          ev.clipboardData.setData('text/plain', this.module.releaseManifest || this.module.manifest);
        }
        document.addEventListener("copy", listener);
        document.execCommand("copy");
        document.removeEventListener("copy", listener);
        this.copyAlert = true;
        setTimeout(() => {
          this.copyAlert = false;
        }, 2500)
      },
    },
  };
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  background-color: var(--v-accent-darken3);

  & .v-lazy {
    display: flex;

    & .v-chip {
      align-self: center;
      margin-right: 16px;
      min-width: fit-content;
    }
  }

  & a {
    color: inherit;
    text-decoration: none;
    word-break: break-word;
  }
}

main {
  margin-bottom: auto;
}

.languageChip.v-chip:hover::before {
  opacity: 0;
}

.languageChip {
  margin-right: 5px;
  margin-bottom: 5px;
}

.copyAlert {
  width: 13.3em;
  position: fixed;
  bottom: 5px;
  left: calc(50% - 6.65em);
  z-index: 1;
}

.deprecated {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;

  & span {
    position: absolute;
    transform: translateX(30%) translateY(0%) rotate(-45deg);
    transform-origin: bottom left;
    bottom: 0;
    right: 0;
    background-color: darkred;
    z-index: 1;
    text-align: center;
    opacity: 0.6;
    font-size: larger;
    padding: 0.2em 0;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      margin: 0 -1px;
      width: 100%;
      height: 100%;
      background-color: darkred;
    }

    &::before {
      right: 100%;
    }

    &::after {
      left: 100%;
    }
  }
}
</style>
