<template>
  <section class="panelWrap">
    <div class="box">
      <div class="left">
        {{ $i18n.locale }}
        {{ $metamask.toDecimals($metamask.fromToken(balance, decimals)) }}
        {{ symbol }}
      </div>
      <div class="right address" @click="handleClick">
        {{ $metamask.hideAddress(address) }}
      </div>
    </div>
    <div class="dialogWrap" @click.self="handleClick" v-show="dialogVisible">
      <section class="dialogBox">
        <!-- address -->
        <div class="dialogAddressBox">
          <a
            class="address"
            :href="`${explorer}/address/${address}`"
            target="_blank"
          >
            {{ $metamask.hideAddress(address) }}
          </a>
        </div>
        <!-- list title -->
        <div class="listTitleBox">
          <p class="title">{{ $t("recentTransactions") }}</p>
          <p class="clear" @click="handleClear">{{ $t("clearAll") }}</p>
        </div>
        <!-- list -->
        <ul class="listBox" v-if="list.length">
          <li v-for="(item, index) in list" :key="index">
            <a
              class="hash"
              :href="`${explorer}/tx/${item.txHash}`"
              target="_blank"
            >
              {{ $metamask.hideAddress(item.txHash) }}
            </a>
            <p class="status">{{ item.status }}</p>
            <!-- <p
              class="status pending el-icon-loading"
              v-if="item.status === 'pending'"
            ></p>
            <p
              class="status success el-icon-success"
              v-if="item.status === 'success'"
            ></p>
            <p
              class="status failed el-icon-warning"
              v-if="item.status === 'failed'"
            ></p> -->
          </li>
        </ul>
        <p class="nodata" v-else>NO DATA</p>
      </section>
    </div>
  </section>
</template>

<script>
import { CHAINS_INFO } from "../../constant";
export default {
  name: "aometamask", // 这里需要注意下，我们是采用的全局注入我们的组件，所以在后面因为我们的组件后，会直接使用这个命名的标签
  props: ["browserurl", "tokenInfo"],
  data() {
    return {
      chainId: "",
      address: "",
      balance: "",
      explorer: "",
      symbol: "",
      decimals: "",
      dialogVisible: true,
      list: [],
    };
  },
  watch: {
    browserurl() {
      this.getBrowserUrl();
    },
  },
  components: {},
  created() {
    // 获取地址
    this.$metamask.connect().then((accounts) => {
      this.address = accounts[0];
      // 获取symbol和decimals
      if (this.tokenInfo && this.tokenInfo.symbol && this.tokenInfo.decimals) {
        this.symbol = this.tokenInfo.symbol;
        this.decimals = this.tokenInfo.decimals;
      } else {
        this.$metamask.getChainId().then((chainId) => {
          this.chainId = chainId;
          if (Object.keys(CHAINS_INFO).includes(chainId)) {
            this.symbol = CHAINS_INFO[chainId].symbol;
            this.decimals = CHAINS_INFO[chainId].decimals;
          }
        });
      }

      // 获取余额
      this.$metamask.getBalance(this.address).then((balance) => {
        console.log("balance", balance);
        this.balance = balance;
      });
      // 获取记录
      this.$metamask.getTxRecord().then((list) => {
        this.list = list;
      });
      // 获取区块浏览器URL
      this.getBrowserUrl();
      this.$metamask.onChainChanged(() => {
        this.getBrowserUrl();
      });

      this.$metamask.onTxStatusChange((list) => {
        console.log("--- onTxStatusChange ---");
        this.list = list;
      });
    });
  },
  methods: {
    handleClick() {
      this.dialogVisible = !this.dialogVisible;
    },
    handleClear() {
      this.$metamask.clearTxRecord();
    },
    getBrowserUrl() {
      if (this.browserurl) {
        this.explorer = this.browserurl;
      } else {
        this.$metamask.getBrowserUrl().then((explorer) => {
          this.explorer = explorer;
        });
      }
    },
  },
};
</script>
<style scoped>
.panelWrap {
  display: inline-block;
}
.panelWrap .address {
  cursor: pointer;
}
.panelWrap p {
  margin: 0;
}
.panelWrap > .box {
  display: flex;
  border-radius: 5px;
  overflow: hidden;
}
.panelWrap > .box > div {
  padding: 0 10px;
  color: #fff;
  line-height: 30px;
}
.panelWrap > .box > div.left {
  background-color: #496fa0;
}
.panelWrap > .box > div.right {
  background-color: #2a2a3f;
}
</style>
<style scoped>
.panelWrap .dialogWrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
}
.panelWrap .dialogWrap > .dialogBox {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  max-width: 600px;
  transform: translateX(-50%) translateY(-50%);
  background-color: #fff;
  border-radius: 3px;
  text-align: left;
  line-height: 1;
  box-sizing: border-box;
}
.panelWrap .dialogWrap > .dialogBox .dialogAddressBox {
  padding: 30px 15px 20px;
}
.panelWrap .dialogWrap > .dialogBox .dialogAddressBox .address {
  color: #000;
  font-size: 20px;
}
.panelWrap .dialogWrap > .dialogBox .listTitleBox {
  display: flex;
  justify-content: space-between;
  padding: 15px 15px 0;
  background-color: #f7f8fa;
}
.panelWrap .dialogWrap > .dialogBox .listTitleBox .title {
  font-size: 14px;
  color: #606266;
}
.panelWrap .dialogWrap > .dialogBox .listTitleBox .clear {
  font-size: 14px;
  color: #04c19e;
  cursor: pointer;
}
.panelWrap .dialogWrap > .dialogBox .listBox {
  margin: 0;
  padding: 15px;
  list-style: none;
  background-color: #f7f8fa;
}

.panelWrap .dialogWrap > .dialogBox .listBox li {
  display: flex;
  justify-content: space-between;
  height: 40px;
  line-height: 40px;
}
.panelWrap .dialogWrap > .dialogBox .nodata {
  padding: 15px;
  font-size: 14px;
  text-align: center;
  background-color: #f7f8fa;
}
</style>

<i18n>
{
  "en": {
    "recentTransactions": "Recent Transactions",
    "clearAll": "clear all"
  },
  "zh": {
    "recentTransactions": "最近的交易",
    "clearAll": "清除所有"
  }
}
</i18n>
