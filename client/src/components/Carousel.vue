<template>
  <v-container fluid pa-0 ma-0>
    <v-hover v-slot:default="{ hover }">
      <v-carousel
        interval="5000"
        :cycle="hover ? false : true"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <div class="text-center font-weight-thin text-h2 py-5">
          Featured Products
        </div>

        <v-carousel-item v-for="(item, i) in productItems" :key="i">
          <v-img :src="item.ProductPhoto" class="mx-auto center"></v-img>
        </v-carousel-item>
      </v-carousel>
    </v-hover>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    productItems: [],
  }),
  created() {
    this.getRecord();
  },
  methods: {
    getRecord() {
      let url = `${this.api}get/Product`;
      axios.get(url).then((res) => {
        this.productItems = res.data.filter((rec) => {
          return !rec.DeletedDate && rec.isFeatured;
        });
      });
    },
  },
};
</script>

<style>
</style>