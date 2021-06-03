<template>
  <div class="dialogWrap" v-show="dialogVisible">
    <section class="dialogBox">
      <!-- address -->
      <div class="dialogAddressBox">
        <a
          class="address"
          :href="`https://hecoinfo.com/address/${address}`"
          target="_blank"
        >
          {{ address | formatAddress }}
        </a>
        <!-- <i class="el-icon-document-copy" @click="handleCopy"></i> -->
        <i
          v-clipboard:copy="address"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          class="el-icon-document-copy"
        ></i>
      </div>
      <!-- list title -->
      <div class="listTitleBox">
        <p class="title">{{ $t("recentTransactions") }}</p>
        <p class="clear" @click="CLEAR_TXNS">{{ $t("clearAll") }}</p>
      </div>
      <!-- list -->
      <ul class="listBox">
        <li v-for="(item, index) in Object.keys(txns)" :key="index">
          <a
            class="hash"
            :href="`https://hecoinfo.com/tx/${txns[item].transactionHash}`"
            target="_blank"
          >
            {{ txns[item].transactionHash | formatAddress }}
          </a>
          <p
            class="status pending el-icon-loading"
            v-if="txns[item].txStatus === 'pending'"
          ></p>
          <p
            class="status success el-icon-success"
            v-if="txns[item].txStatus === 'success'"
          ></p>
          <p
            class="status failed el-icon-warning"
            v-if="txns[item].txStatus === 'failed'"
          ></p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "test-panel", // 这里需要注意下，我们是采用的全局注入我们的组件，所以在后面因为我们的组件后，会直接使用这个命名的标签
  props: ["list"],
  data() {
    return {
      checkedNumber: "",
    };
  },
  components: {},
  methods: {
    clickThisNumber(e) {
      this.checkedNumber = this.checkedNumber.concat(e.currentTarget.innerHTML);
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