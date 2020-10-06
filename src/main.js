import Vue from 'vue'
import { VuePlugin } from 'vuera'
import App from './App.vue'
import router from './router'
import store from './store'
import 'graphiql/graphiql.css'

Vue.config.productionTip = false
Vue.use(VuePlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
