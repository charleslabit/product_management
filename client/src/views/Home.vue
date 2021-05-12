<template>
  <div id="product" class="my-10">

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

        <v-carousel-item v-for="(item, i) in featuredProduct" :key="i">
          <v-img :src="item.ProductPhoto" class="mx-auto center"></v-img>
        </v-carousel-item>
      </v-carousel>
    </v-hover>

    <h1 class="text-center text-h2 font-weight-thin py-10">Latest Product</h1>

    <v-row dense class="ma-4">
      <v-col
        lg="3"
        md="4"
        sm="6"
        cols="12"
        v-for="(item, index) in productItems"
        :key="item.ProductName"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-card v-on="on" v-bind="attrs" flat class="ma-3">
              <v-img :src="item.ProductPhoto" class="mx-auto center"> </v-img>
              <div class="text-right pa-0 ma-0 my-2">
                <span v-if="item.quantity > 0">
                  Current Stock:
                  {{ item.quantity }}
                </span>
                <span v-else> Out of stock </span>
              </div>
              <div
                class="font-weight-medium text-h6"
                id="truncate-text-name"
                style="min-height: 60px"
              >
                {{ item.ProductName }}
              </div>

              <div
                class="font-weight-light"
                id="truncate-text-desc"
                style="min-height: 100px"
              >
                {{ item.ProductDescription }}
              </div>
              <v-card-actions>
                <v-chip outlined color="#1565c0"
                  ><span class="text-h6">${{ item.price }}</span></v-chip
                >
                <v-spacer></v-spacer>
                <v-btn
                  :dark="item.quantity != 0"
                  color="#1565c0"
                  @click="addToCart(item, index)"
                  :disabled="item.quantity == 0"
                  >Add to Cart
                  <v-icon>mdi-cart-arrow-down</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
          <div class="text-h5">{{ item.ProductName }}</div>
          <div>{{ item.ProductDescription }}</div>
        </v-tooltip>
      </v-col>
    </v-row>
    <br>
    <Footer/>>  
  </div>
</template>

<script>
import axios from "axios";
import Footer from '../components/Footer'
export default {
  components:{
Footer
  },
  data: () => ({
    productItems: [],
  }),
  created() {
    this.getRecord();
  },
  methods: {
    addToCart(value, index) {
      this.ADD_CART_ITEM(value);
      this.productItems[index].quantity = this.productItems[index].quantity - 1;
    },

    getRecord() {
      let url = `${this.api}get/Product`;
      axios.get(url).then((res) => {
        this.productItems = res.data
          .filter((rec) => {
            return !rec.DeletedDate;
          })
          .map((rec) => {
            rec.quantity = Math.floor(Math.random() * 10);
            rec.price = Math.floor(Math.random() * 1000);
            rec.order = 0;
            return rec;
          });
      });
    },
  },
  computed: {
    featuredProduct() {
      return this.productItems.filter((rec) => {
        return rec.isFeatured;
      });
    },
    
  },
};
</script>

<style>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

#truncate-text-name {
  max-height: 4rem;
  overflow: hidden !important;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
}

#truncate-text-desc {
  max-height: 6rem;
  overflow: hidden !important;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
}
</style>
