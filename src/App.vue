<template>
  <div id="app">
    <img alt="Vue logo" @click="addItem" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <test-panel ref="panel" :list="list" />
    <test-toast ref="toast" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    const chain = 'eth'
    this.list = this.$myBus.data[chain];
    this.$myBus.onchange = (chain) => {
      console.log("change", chain);
      this.list = this.$myBus.data[chain];
      console.log("this.list", this.list);
    };
    // console.log("this.$myBus", this.$myBus);
    this.$myBus.addItem("eth", {
      hash: "0x1",
    });
    // this.$addItemRecord("eth", "0x1");
    // this.$addItemRecord("eth", "0x2");
    // console.log(this.$addRecord("eth"));
  },
  methods: {
    addItem() {
      this.$myBus.addItem("eth", {
        hash: "0x2",
      });
    },
    hc() {
      console.log("hchchc");
      this.$nextTick(() => {
        this.$refs.toast.toastPlugin("======", 2000);
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
