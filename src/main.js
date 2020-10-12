import Vue from 'vue'
import { VuePlugin } from 'vuera'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from "vue-cookies"
import Fragment from 'vue-fragment'
import 'graphiql/graphiql.css'

Vue.config.productionTip = false
Vue.use(VuePlugin)
Vue.use(Fragment.Plugin)
Vue.use(VueCookies)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
