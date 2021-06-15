<template>
  <div id="app">
    <aometamask />
  </div>
</template>

<script>
import { BigNumber } from "ethers";

export default {
  name: "App",
  data() {
    return {
      provider: null,
      address: undefined,
      list: [
        {
          address: "0x",
          hash: "0x",
          status: "success",
        },
      ],
    };
  },
  created() {},
  methods: {
    sendTx() {
      const amount = "92675224800514997";
      console.log(BigNumber.from(amount).toHexString());
      this.$metamask.sendTx({
        from: "0x6c999dbc796102774E7CF2b45eD9097a8C0F4d7A",
        to: "0x867f1469356D37313406b75c461fA057c829c749",
        value: BigNumber.from(amount).toHexString(),
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
