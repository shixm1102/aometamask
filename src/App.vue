<template>
  <div id="app">
    <img alt="Vue logo" @click="addItem" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <test-panel ref="panel" address="0x" chain="eth" :list="list" />
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
      list: [
        {
          address: "0x",
          hash: "0x",
          status: "success",
        },
      ],
    };
  },
  mounted() {
    console.log(this.$refs.panel);
    this.$refs.panel.addItem({
      item: {
        chain: "eth",
        address: "0x",
        hash: "0x1",
        status: "success",
      },
      chain: "eth",
      address: "0x",
    });
    // this.$addItemRecord("eth", "0x1");
    // this.$addItemRecord("eth", "0x2");
    // console.log(this.$addRecord("eth"));
  },
  methods: {
    addItem() {
      this.$refs.panel.addItem({
        item: {
          chain: "eth",
          address: "0x",
          hash: "0x1",
          status: "success",
        },
        chain: "eth",
        address: "0x",
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
