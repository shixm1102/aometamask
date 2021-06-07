<template>
  <section class="panelWrap">
    <div class="box">
      <div class="left">{{ balance }}</div>
      <div class="right" @click="handleClick">{{ address }} {{ explorer }}</div>
    </div>
    <div class="dialogWrap" v-show="dialogVisible">
      <section class="dialogBox">
        <!-- address -->
        <div class="dialogAddressBox">
          <a
            class="address"
            :href="`${explorer}/address/${address}`"
            target="_blank"
          >
            {{ address }}
          </a>
        </div>
        <!-- list title -->
        <div class="listTitleBox">
          <p class="title">{{ $t("recentTransactions") }}</p>
          <p class="clear">{{ $t("clearAll") }}</p>
        </div>
        <!-- list -->
        <ul class="listBox">
          <li v-for="(item, index) in list" :key="index">
            <a
              class="hash"
              :href="`${explorer}/tx/${item.txHash}`"
              target="_blank"
            >
              {{ item.txHash }}
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
      </section>
    </div>
  </section>
</template>

<script>
export default {
  name: "test-panel", // 这里需要注意下，我们是采用的全局注入我们的组件，所以在后面因为我们的组件后，会直接使用这个命名的标签
  props: ["browserurl", "tokenInfo"],
  data() {
    return {
      address: "",
      balance: "",
      explorer: "",
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
  mounted() {
    // 获取地址
    this.$metamask.connect().then((accounts) => {
      this.address = accounts[0];
      // 获取余额
      this.$metamask.getBalance(this.address).then((balance) => {
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
    });
  },
  methods: {
    handleClick() {
      this.dialogVisible = !this.dialogVisible;
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
