<template>
  <div class="hello">
    <shixmetamask />
  </div>
</template>

<script>
import { BigNumber } from "ethers";
export default {
  name: "HelloWorld",
  created() {
    // this.sendContract();
    // this.sendTx();
  },
  methods: {
    sendTx() {
      const amount = "92675224800514997";
      // console.log(utils.hexlify(amount));
      console.log(BigNumber.from(amount).toHexString());
      this.$metamask.sendTx({
        from: "0x6c999dbc796102774E7CF2b45eD9097a8C0F4d7A",
        to: "0x867f1469356D37313406b75c461fA057c829c749",
        value: BigNumber.from(amount).toHexString(),
      });
    },
    sendContract() {
      const abi = [
        // Some details about the token
        "function name() view returns (string)",
        "function symbol() view returns (string)",

        // Get the account balance
        "function balanceOf(address) view returns (uint)",

        // Send some of your tokens to someone else
        "function transfer(address to, uint amount)",

        // An event triggered whenever anyone transfers to someone else
        "event Transfer(address indexed from, address indexed to, uint amount)",
      ];
      this.$metamask.sendContract(
        "0x5595ad3ec993bdb978d4a182d913a29ffcc0b5a9",
        abi,
        "transfer",
        ["0x6c999dbc796102774E7CF2b45eD9097a8C0F4d7A", "1000000000000000000"]
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
