<template>
  <v-app>
    <Parallax></Parallax>
    <v-app-bar app dark color="#1565c0">
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" class="hidden-md-and-up">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list dark color="#1565c0">
          <v-list-item v-for="(item, i) in pageList" :key="i" :to="item.routes">
            <v-list-item-icon>
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-spacer></v-spacer>
      <v-btn
        text
        v-for="item in pageList"
        :key="item.title"
        :to="item.routes"
        class="mx-auto hidden-sm-and-down"
      >
        <v-icon>
          {{ item.icon }}
        </v-icon>
        {{ item.title }}
      </v-btn>

      <v-menu
        offset-y
        :close-on-content-click="false"
        v-if="$route.name == 'Home'"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-badge
            class="ma-4"
            color="#1565c0"
            :content="computedCartItems.length"
          >
            <v-icon
              v-if="computedCartItems.length > 0"
              v-bind="attrs"
              v-on="on"
            >
              mdi-cart
            </v-icon>
            <v-icon v-else> mdi-cart </v-icon>
          </v-badge>
        </template>

        <v-card v-if="computedCartItems.length > 0">
          <v-card style="overflow-y: scroll" max-height="500">
            <v-list v-for="(item, i) in computedCartItems" :key="i">
              <v-list-item>
                <span class="mr-2">x{{ item.order }}</span>

                <v-list-item-avatar>
                  <v-img :src="item.ProductPhoto"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="ml-2">
                    {{ item.ProductName }}
                  </v-list-item-title>
                  <v-list-item-subtitle
                    class="ml-3 text-truncate"
                    style="max-width: 300px"
                  >
                    {{ item.ProductDescription }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon @click="removeToCart(i)" color="error"
                    >mdi-delete</v-icon
                  >
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
          <v-card-actions>
            <v-btn dark color="primary" @click="checkOut" width="100%">
              <v-icon> mdi-check-box-outline </v-icon>
              Check Out
            </v-btn>
          </v-card-actions>

          <v-divider></v-divider>
        </v-card>
      </v-menu>
      <v-spacer
        v-if="
          $vuetify.breakpoint.name != 'sm' && $vuetify.breakpoint.name != 'xs'
        "
      ></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Swal from "sweetalert2";
import Parallax from "./components/Parallax.vue";
export default {
  name: "App",

  components: {
    Parallax,
  },

  data: () => ({
    pageList: [
      { title: "Home", icon: "mdi-home", routes: "/" },
      { title: "Manage", icon: "mdi-basket", routes: "/manage" },
    ],
  }),
  created() {},
  methods: {
    removeToCart(value) {
      this.REMOVE_CART_ITEM(value);
    },
    checkOut() {
      Swal.fire({
        title: "Are you sure?",
        text: "You will make a purchase",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.TRUNCATE_CART_ITEM();

          Swal.fire("Success!", "Your Purchase was Successful !", "success");
        }
      });
    },
  },
  computed: {
    computedCartItems() {
      return this.cartItems;
    },
   
  },

  mounted() {},
};
</script>

<style>

</style>
