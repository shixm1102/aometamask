<template>
  <div class="dialogWrap" v-show="dialogVisible">
    <section class="dialogBox">
      <!-- address -->
      <div class="dialogAddressBox">
        <a
          class="address"
          :href="`${browser.heco}/address/${address}`"
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
            :href="`${browser.heco}/tx/${item.hash}`"
            target="_blank"
          >
            {{ item.hash }}
          </a>
          <p
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
          ></p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "test-panel", // 这里需要注意下，我们是采用的全局注入我们的组件，所以在后面因为我们的组件后，会直接使用这个命名的标签
  props: ["chain", "address", "browserurl"],
  data() {
    return {
      dialogVisible: true,
      browser: {
        eth: "https://cn.etherscan.com",
        heco: "https://hecoinfo.com",
      },
      list: [],
      data: {},
    };
  },
  components: {},
  methods: {
    addItem({ item, chain, address }) {
      console.log("--- addItem ---", { item, chain, address });
      if (!this.data[address]) {
        this.data[address] = {};
        this.data[address][chain] = [];
      } else if (!this.data[address][chain]) {
        this.data[address][chain] = [];
      }
      this.data[address][chain].unshift(item);
      this.save({ address, chain });
    },
    changeItem({ item, chain, address }) {
      console.log("--- changeItem ---", { item, chain, address });
      if (!this.data[address]) {
        throw Error(`请核对${address}是否正确`);
      }
      if (!this.data[address][chain]) {
        throw Error(`请核对${chain}是否正确`);
      }
      this.data[address][chain].forEach((currentItem, index) => {
        if (item.hash === currentItem.hash) {
          this.data[address][chain].splice(index, 1, item);
          this.save({ address, chain });
        }
      });
    },
    removeItem({ item, chain, address }) {
      console.log("--- removeItem ---", { item, chain, address });
      if (!this.data[address]) {
        throw Error(`请核对${address}是否正确`);
      }
      if (!this.data[address][chain]) {
        throw Error(`请核对${chain}是否正确`);
      }
      this.data[address][chain].forEach((currentItem, index) => {
        if (item.hash === currentItem.hash) {
          this.data[address][chain].slice(index, 1);
          this.save({ address, chain });
        }
      });
    },
    save({ address, chain }) {
      this.list = this.data[address][chain];
      sessionStorage[address + "-" + chain] = JSON.stringify(
        this.data[address][chain]
      );
    },
    clearAll({ address, chain }) {
      console.log("--- clearAll ---", { chain, address });
      this.data[address][chain] = [];
      this.save({ address, chain });
    },
  },
};
</script>

<style>
.number-show {
  height: 20px;
}
.number-panel ul {
  padding: 0;
}
.number-panel ul li {
  display: inline-block;
  width: 28%;
  height: 50px;
  line-height: 50px;
  margin-top: 20px;
  background: #ddd;
  border-radius: 8px;
  margin-right: 10px;
}
.number-panel ul li input {
  display: none;
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
