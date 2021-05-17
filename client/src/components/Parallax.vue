<template>
  <v-container fluid pa-0 ma-0>
    <v-parallax
      v-if="$route.name == 'Home'"
      class="hidden-sm-and-down"
      :class="computedParallex"
      src="https://gatoledo.com/proj-codepen/rocket1.png"
    >
    </v-parallax>
  </v-container>
</template>

<script>
export default {
  computed: {
    computedParallex() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl": {
          return "parallax-xl";
        }
        case "lg": {
          return "parallax-lg";
        }
        case "md": {
          return "parallax-md";
        }
        default: {
          return "parallax";
        }
      }
    },
  },
};
</script>

<style>
.parallax-xl {
  height: auto !important;
  width: 100% !important;
  padding: 80% 0 0;
}
.parallax-lg {
  height: auto !important;
  width: 100% !important;
  padding: 85% 0 0;
}
.parallax-md {
  height: auto !important;
  width: 100% !important;
  padding: 140% 0 0;
}

.parallax {
  height: auto !important;
  width: 100% !important;
  padding: 100% 0 0;
}
</style>