import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartItems: [],
  },
  mutations: {
    ADD_CART_ITEM: (state, data) => {
      const items = [...state.cartItems];
      const itemsID = items.map((rec) => {
        return rec.ProductID;
      });
      const index = itemsID.indexOf(data.ProductID);

      if (index != -1) {
        state.cartItems[index].order = state.cartItems[index].order + 1;
      } else {
        data.order = 1;
        state.cartItems.push(data);
      }
    },
    REMOVE_CART_ITEM: (state, data) => {
      state.cartItems.splice(data, 1);
    },
    // TOGGLE_CART_ITEMS: (state, data) => {
    //   state.cartItems[data].done = !state.cartItems[data].done;
    // },
    TRUNCATE_CART_ITEM: (state) => {
      state.cartItems = [];
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState()],
});
