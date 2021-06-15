import { ethers } from "ethers";
import BigNumber from "bignumber.js";

export default class MetaMask {
  constructor(isDebugger) {
    this.isDebugger = isDebugger;
    this.emitTxStatusChangeList = [];
  }
  initialize() {}
  /**
   * 是否安装了MetaMask
   * @returns {Boolean}
   * */
  isMetaMaskInstalled() {
    //Have to check the ethereum binding on the window object to see if it's
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  }
  /**
   * 连接钱包
   * @returns {Array} [address]
   * */
  async connect() {
    if (typeof window.ethereum !== "undefined") {
      if (this.isDebugger) console.log("MetaMask is !");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (this.isDebugger) console.log("eth_requestAccounts", accounts);
        return accounts;
      } catch (error) {
        throw Error(error);
      }
    } else {
      throw Error("Please install MetaMask!");
    }
  }

  /**
   * 发送交易
   * @param {Object} transactionParameters
   * @param {string} transactionParameters.chainId - Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
   * @param {string} transactionParameters.nonce - ignored by MetaMask
   * @param {string} transactionParameters.gasPrice - customizable by user during MetaMask confirmation.
   * @param {string} transactionParameters.gas - customizable by user during MetaMask confirmation.
   * @param {string} transactionParameters.from - must match user's active address.
   * @param {string} transactionParameters.to - Required except during contract publications.
   * @param {string} transactionParameters.value - Only required to send ether to the recipient from the initiating external account.
   * @param {string} transactionParameters.data - Optional, but used for defining smart contract creation and interaction.
   * @returns {String} txHash
   * */
  async sendTx(transactionParameters) {
    if (this.isDebugger) console.log("--- senfTx ---", transactionParameters);
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    const { from, chainId } = transactionParameters;
    this._addTxRecord({
      address: from,
      chainId,
      txHash,
      status: "pending",
    });
    this.onTxHash(txHash);
    return txHash;
  }
  async signMessage(address, message) {
    const result = await window.ethereum.request({
      method: "personal_sign",
      params: [address, message],
    });

    return result;
  }
  /**
   * Return isMetaMask
   * @returns {Boolean}
   */
  isMetaMask() {
    return window.ethereum.isMetaMask;
  }
  /**
   * 获取账户
   * @returns {Array} [address]
   */
  async getAccount() {
    const isUnlocked = await window.ethereum._metamask.isUnlocked();
    if (isUnlocked) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      return accounts;
    } else {
      const accounts = await this.connect();
      return accounts;
    }
  }
  /**
   * 获取公链ID
   * @returns {String}
   */
  async getChainId() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    return Number(chainId).toString();
  }
  /**
   * 获取余额
   * @returns {Number} balance
   */
  async getBalance(address) {
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });
    return new BigNumber(balance).toString();
  }

  onChainChanged(handleChainChanged) {
    window.ethereum.on("chainChanged", handleChainChanged);
  }

  onAccountsChanged(handleAccountsChanged) {
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  }

  onMessage(handleMessage) {
    window.ethereum.on("message", handleMessage);
  }
  /**
   * 调用合约读方法
   * @param {String} contractAddress
   * @param {Array} abi
   * @param {String} name 调用的合约方法
   * @param {Array} params name方法的传参
   * @returns
   */
  async callContract(contractAddress, abi, name, params) {
    if (this.isDebugger)
      console.log("--- callContract ---", {
        contractAddress,
        abi,
        name,
        params,
      });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // The Contract object
    const contract = new ethers.Contract(contractAddress, abi, provider);
    if (params) return await contract[name](...params);
    return await contract[name]();
  }
  /**
   * * 调用合约写方法
   * @param {String} contractAddress
   * @param {Array} abi
   * @param {String} name 调用的合约方法
   * @param {Array} params name方法的传参
   * @returns
   */
  async sendContract(contractAddress, abi, name, params) {
    if (this.isDebugger)
      console.log("--- sendContract ---", {
        contractAddress,
        abi,
        name,
        params,
      });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // The Contract object
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const contractWithSigner = contract.connect(signer);
    let result;
    if (params) {
      result = await contractWithSigner[name](...params);
    } else {
      result = await contractWithSigner[name]();
    }
    const { from, hash } = result;
    const chainId = await this.getChainId();
    this._addTxRecord({
      address: from,
      chainId,
      txHash: hash,
      status: "pending",
    });
    this.onTxHash(hash);
    return result;
  }
  /**
   * 监听交易hash状态变化
   * @param {String} txHash
   */
  onTxHash(txHash) {
    if (this.isDebugger) console.log("--- onTxHash ---", txHash);
    return new Promise((resolve) => {
      this.getChainId().then((chainId) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        provider.once(txHash, (transaction) => {
          // Emitted when the transaction has been mined
          if (this.isDebugger) console.log("transaction", transaction);
          const { from, status } = transaction;
          this._changeTxStatus({
            address: from,
            chainId,
            txHash,
            status: status === 1 ? "success" : "failed",
          });
          resolve(transaction);
        });
      });
    });
  }
  /**
   * 获取交易记录
   * @returns
   */
  async getTxRecord() {
    if (this.isDebugger)
      console.log("--- getTxRecord ---", { address, chainId });
    const [accounts, chainId] = await Promise.all([
      this.getAccount(),
      this.getChainId(),
    ]);
    const address = accounts[0];
    const key = (address + chainId).toLowerCase();
    let list = sessionStorage[key] ? JSON.parse(sessionStorage[key]) : [];
    if (!Array.isArray(list)) {
      list = [];
    }
    if (this.isDebugger) console.log("--- getTxRecord result ---", list);
    return list;
  }
  async getPendingTxRecord() {
    if (this.isDebugger) console.log("--- getPendingTxRecord ---");
    const [accounts, chainId] = await Promise.all([
      this.getAccount(),
      this.getChainId(),
    ]);
    const address = accounts[0];
    const key = (address + chainId).toLowerCase();
    let list = sessionStorage[key] ? JSON.parse(sessionStorage[key]) : [];
    if (!Array.isArray(list)) {
      list = [];
    }
    return list.filter((item) => {
      return item.status === "pending";
    });
  }
  async clearTxRecord() {
    const [accounts, chainId] = await Promise.all([
      this.getAccount(),
      this.getChainId(),
    ]);
    const address = accounts[0];
    const key = (address + chainId).toLowerCase();
    if (this.isDebugger) console.log("--- clearTxRecord ---", key);
    sessionStorage[key] = [];
    this._emitTxStatusChange([]);
  }
  /**
   * 新增记录
   * @param {Object} param0
   */
  async _addTxRecord({ address, chainId, txHash, status }) {
    if (this.isDebugger)
      console.log("--- _addTxRecord ---", { address, chainId, txHash, status });
    const key = (address + chainId).toLowerCase();
    let list = sessionStorage[key] ? JSON.parse(sessionStorage[key]) : [];
    if (!Array.isArray(list)) {
      list = [];
    }
    list.push({
      address,
      chainId,
      txHash,
      status,
    });
    sessionStorage[key] = JSON.stringify(list);
    this._emitTxStatusChange(list);
  }
  /**
   * 改变记录状态
   * @param {Object} param0
   */
  async _changeTxStatus({ address, chainId, txHash, status }) {
    if (this.isDebugger)
      console.log("--- _changeTxStatus ---", {
        address,
        chainId,
        txHash,
        status,
      });
    const key = (address + chainId).toLowerCase();
    let list = sessionStorage[key] ? JSON.parse(sessionStorage[key]) : [];
    if (!Array.isArray(list)) {
      list = [];
    }
    const result = list.map((item) => {
      if (item.txHash === txHash) {
        return { address, chainId, txHash, status };
      }
      return item;
    });
    sessionStorage[key] = JSON.stringify(result);
    this._emitTxStatusChange(result);
  }
  async _emitTxStatusChange(result) {
    if (this.isDebugger) console.log("--- emitTxStatusChange ---", result);
    this.emitTxStatusChangeList.map((item) => {
      if (typeof item === "function") {
        item(result);
      }
    });
  }
  async onTxStatusChanged(handleTxStatusChanged) {
    this.emitTxStatusChangeList.push(handleTxStatusChanged);
    if (this.isDebugger) console.log(this.emitTxStatusChangeList);
  }
  hideAddress(address, bef = 6, aft = 6) {
    let len = Number(bef) + Number(aft);
    if (address.length <= len) {
      return address;
    }
    return address.substr(0, bef) + "..." + address.substr(-aft);
  }
  toDecimals(number, decimal = 6) {
    return new BigNumber(number).decimalPlaces(decimal).toString();
  }
  fromToken(number, precision) {
    return new BigNumber(number).shiftedBy(-precision).toString();
  }
  toToken(number, precision) {
    return new BigNumber(number).shiftedBy(precision).toString();
  }
}

// function getSigner() {
//   if (window.ethereum) {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     return signer;
//   } else if (window.web3) {
//     const provider = new ethers.providers.Web3Provider(
//       window.web3.currentProvider
//     );
//     const signer = provider.getSigner();
//     return signer;
//   }
// }
