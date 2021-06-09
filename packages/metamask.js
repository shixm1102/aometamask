import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { CHAINS_INFO } from "./constant";

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
   * @param {string} transactionParameters.nonce - ignored by MetaMask
   * @param {string} transactionParameters.gasPrice - customizable by user during MetaMask confirmation.
   * @param {string} transactionParameters.gas - customizable by user during MetaMask confirmation.
   * @param {string} transactionParameters.to - Required except during contract publications.
   * @param {string} transactionParameters.from - must match user's active address.
   * @param {string} transactionParameters.value - Only required to send ether to the recipient from the initiating external account.
   * @param {string} transactionParameters.data - Optional, but used for defining smart contract creation and interaction.
   * @param {string} transactionParameters.chainId - Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
   * @returns {String} txHash
   * */
  async sendTx(transactionParameters) {
    console.log("--- senfTx ---", transactionParameters);
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    const { from, chainId } = transactionParameters;
    this.addTxRecord({
      address: from,
      chainId,
      txHash,
      status: "pending",
    });
    this.onTxHash({ chainId, txHash });
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
  async getBrowserUrl() {
    let explorer = "";
    const chainId = await this.getChainId();
    Object.keys(CHAINS_INFO).forEach((key) => {
      if (key === chainId) {
        explorer = CHAINS_INFO[key].explorer;
      }
    });
    return explorer;
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

  getSigner() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return signer;
    } else if (window.web3) {
      const provider = new ethers.providers.Web3Provider(
        window.web3.currentProvider
      );
      const signer = provider.getSigner();
      return signer;
    }
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
    const { chainId, from, hash } = result;
    this.addTxRecord({
      address: from,
      chainId,
      txHash: hash,
      status: "pending",
    });
    this.onTxHash({ chainId, txHash: hash });
    return result;
  }
  /**
   * 监听交易hash状态变化
   * @param {String} txHash
   */
  onTxHash({ chainId, txHash }) {
    if (this.isDebugger) console.log("--- onTxHash ---", { chainId, txHash });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.once(txHash, (transaction) => {
      // Emitted when the transaction has been mined
      if (this.isDebugger) console.log("transaction", transaction);
      const { from, status } = transaction;
      this.changeTxStatus({
        address: from,
        chainId,
        txHash,
        status: status === 1 ? "success" : "failed",
      });
    });
  }
  /**
   * 获取地址和链ID
   * @param {String} address
   * @param {Number} chainId
   * @returns
   */
  async getAddrChainId(address, chainId) {
    if (!address && !chainId) {
      const [accounts, _chainId] = await Promise.all([
        this.getAccount(),
        this.getChainId(),
      ]);
      address = accounts[0];
      chainId = _chainId;
    } else {
      if (!chainId) {
        chainId = await this.getChainId();
      }
      if (!address) {
        const accounts = await this.getAccount();
        address = accounts[0];
      }
    }
    return {
      _address: address,
      _chainId: chainId,
    };
  }
  /**
   * 获取交易记录
   * @param {String} address
   * @param {Number} chainId
   * @returns
   */
  async getTxRecord(address, chainId) {
    if (this.isDebugger)
      console.log("--- getTxRecord ---", { address, chainId });
    const { _address, _chainId } = await this.getAddrChainId(address, chainId);
    const key = (_address + _chainId).toLowerCase();
    let list = sessionStorage[key] ? JSON.parse(sessionStorage[key]) : [];
    if (!Array.isArray(list)) {
      list = [];
    }
    if (this.isDebugger) console.log("--- getTxRecord result ---", list);
    return list;
  }
  async getPendingTxRecord() {
    if (this.isDebugger) console.log("--- getPendingTxRecord ---");
    const { _address, _chainId } = await this.getAddrChainId();
    const list = await this.getTxRecord(_address, _chainId);
    return list.filter((item) => {
      return item.status === "pending";
    });
  }
  async clearTxRecord(address, chainId) {
    const { _address, _chainId } = await this.getAddrChainId(address, chainId);
    const key = (_address + _chainId).toLowerCase();
    console.log("key", key);
    // sessionStorage[key] = [];
    this.emitTxStatusChange([]);
  }
  /**
   * 新增记录
   * @param {Object} param0
   */
  async addTxRecord({ address, chainId, txHash, status }) {
    if (this.isDebugger)
      console.log("--- addTxRecord ---", { address, chainId, txHash, status });
    const { _address, _chainId } = await this.getAddrChainId(address, chainId);
    const list = await this.getTxRecord(_address, _chainId);
    list.push({
      address: _address,
      chainId: _chainId,
      txHash,
      status,
    });
    const key = (_address + _chainId).toLowerCase();
    sessionStorage[key] = JSON.stringify(list);
    this.emitTxStatusChange(list);
  }
  /**
   * 改变记录状态
   * @param {Object} param0
   */
  async changeTxStatus({ address, chainId, txHash, status }) {
    if (this.isDebugger)
      console.log("--- changeTxStatus ---", {
        address,
        chainId,
        txHash,
        status,
      });
    const { _address, _chainId } = await this.getAddrChainId(address, chainId);
    const list = await this.getTxRecord(_address, _chainId);
    const result = list.map((item) => {
      if (item.txHash === txHash) {
        return { address: _address, chainId: _chainId, txHash, status };
      }
      return item;
    });
    const key = (_address + _chainId).toLowerCase();
    sessionStorage[key] = JSON.stringify(result);
    this.emitTxStatusChange(result);
  }
  async emitTxStatusChange(result) {
    if (this.isDebugger) console.log("--- emitTxStatusChange ---", result);
    this.emitTxStatusChangeList.map((item) => {
      if (typeof item === "function") {
        item(result);
      }
    });
  }
  async onTxStatusChange(handleTxStatusChanged) {
    this.emitTxStatusChangeList.push(handleTxStatusChanged);
    console.log(this.emitTxStatusChangeList);
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
