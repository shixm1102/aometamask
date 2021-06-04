import Vue from 'vue'
import App from './App.vue'
import vueToastPanel from './plugin/test'
import i18n from './i18n'
Vue.config.productionTip = false
Vue.use(vueToastPanel)


new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
