import Vue from "vue";
import App from "./App.vue";
import aometamask from "../packages/index";
import i18n from "./i18n";
Vue.config.productionTip = false;
Vue.use(aometamask);

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount("#app");
