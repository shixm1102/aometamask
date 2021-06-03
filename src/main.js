import Vue from 'vue'
import App from './App.vue'
import vueToastPanel from './plugin/test'
Vue.config.productionTip = false
Vue.use(vueToastPanel)


new Vue({
  render: h => h(App),
}).$mount('#app')
