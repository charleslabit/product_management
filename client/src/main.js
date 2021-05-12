import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import myPlugins from './plugins/myMixins'

Vue.config.productionTip = false
Vue.use(myPlugins)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
