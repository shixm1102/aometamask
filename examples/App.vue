<template>
  <div id="app">
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import { ethers, BigNumber } from "ethers";
export default {
  name: "App",
  components: {
    HelloWorld,
  },
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
  created() {
    this.connect();
  },
  methods: {
    async connect() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setTimeout(() => {
        // A Web3Provider wraps a standard Web3 provider, which is
        // what Metamask injects as window.ethereum into each page
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // The Metamask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        // const signer = provider.getSigner();
        // console.log("signer", signer);
        // signer.signMessage("hello").then(console.log);
        // const abi = [
        //   // Some details about the token
        //   "function name() view returns (string)",
        //   "function symbol() view returns (string)",
        //   // Get the account balance
        //   "function balanceOf(address) view returns (uint)",
        //   // Send some of your tokens to someone else
        //   "function transfer(address to, uint amount)",
        //   // An event triggered whenever anyone transfers to someone else
        //   "event Transfer(address indexed from, address indexed to, uint amount)",
        // ];
        // this.sendContract(
        //   "0x5595ad3ec993bdb978d4a182d913a29ffcc0b5a9",
        //   abi,
        //   "transfer",
        //   ["0x6c999dbc796102774E7CF2b45eD9097a8C0F4d7A", "0xff"]
        // ).then((txHash) => {
        //   console.log("txHash", txHash);
        //   provider.once(txHash.hash, (transaction) => {
        //     // Emitted when the transaction has been mined
        //     console.log("transaction", transaction);
        //   });
        // });
      }, 5000);
      const chainId = await this.getChainId();
      const balance = await this.getBalance(accounts[0]);
      console.log("chainId", chainId);
      console.log("balance", balance);
    },
    async callContract(contractAddress, abi, name, params) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // The Contract object
      const contract = new ethers.Contract(contractAddress, abi, provider);
      if (params) return await contract[name](...params);
      return await contract[name]();
    },

    async sendContract(contractAddress, abi, name, params) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // The Contract object
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const contractWithSigner = contract.connect(signer);
      if (params) return await contractWithSigner[name](...params);
      await contractWithSigner[name]();
    },

    async getChainId() {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      return BigNumber.from(chainId).toNumber();
    },
    async getBalance(address) {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      return BigNumber.from(balance).toString();
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
