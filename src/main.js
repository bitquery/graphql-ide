import Vue from 'vue'
import { VuePlugin } from 'vuera'
import Toast from 'vue-toastification'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import Fragment from 'vue-fragment'
import 'graphiql/graphiql.css'
import 'vue-toastification/dist/index.css'
import './style/main.css'

Vue.config.productionTip = false
Vue.use(VuePlugin)
Vue.use(Fragment.Plugin)
Vue.use(VueCookies)
Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
