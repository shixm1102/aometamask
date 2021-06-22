import Vue from "vue";
import App from "./App.vue";
import aometamask from "../packages/index";
Vue.config.productionTip = false;
Vue.use(aometamask);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
