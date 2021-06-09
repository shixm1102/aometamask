const ETH_MAINNET = "https://ethmainnet.anyswap.exchange";
// const ETH_MAINNET = 'https://mainnet.infura.io/v3/0e40cfd5e7a64b2d9aea8427e4bd52a0'
const ETH_MAIN_CHAINID = 1;
const ETH_MAIN_EXPLORER = "https://cn.etherscan.com";

const HT_MAINNET = "https://http-mainnet-node1.hecochain.com";
const HT_MAIN_CHAINID = 128;
const HT_MAIN_EXPLORER = "https://hecoinfo.com/";

const HT_TESTNET = "https://http-testnet.hecochain.com";
const HT_TEST_CHAINID = 256;
const HT_TEST_EXPLORER = "https://testnet.hecoinfo.com/";

const BNB_MAINNET = "https://bsc-dataseed1.binance.org";
const BNB_MAIN_CHAINID = 56;
const BNB_MAIN_EXPLORER = "https://bscscan.com";

const OKT_MAINNET = "https://exchainrpc.okex.org";
const OKT_MAIN_CHAINID = 66;
const OKT_MAIN_EXPLORER = "https://www.oklink.com/okexchain";

// const OKT_TESTNET = 'https://exchaintest.okexcn.com'
// const OKT_TEST_CHAINID = 65
// const OKT_TEST_EXPLORER = 'https://www.oklink.com/okexchain-test/'

const HOO_MAINNET = "https://http-mainnet.hoosmartchain.com";
const HOO_MAIN_CHAINID = 70;
const HOO_MAIN_EXPLORER = "https://www.hscscan.com";

export const CHAINS_INFO = {
  1: {
    rpc: ETH_MAINNET,
    chainID: ETH_MAIN_CHAINID,
    lookHash: ETH_MAIN_EXPLORER + "/tx/",
    lookAddr: ETH_MAIN_EXPLORER + "/address/",
    explorer: ETH_MAIN_EXPLORER,
    symbol: "ETH",
    name: "Ethereum",
    type: "main",
    label: "ETH_MAIN",
    decimals: 18,
  },
  56: {
    rpc: BNB_MAINNET,
    chainID: BNB_MAIN_CHAINID,
    lookHash: BNB_MAIN_EXPLORER + "/tx/",
    lookAddr: BNB_MAIN_EXPLORER + "/address/",
    explorer: BNB_MAIN_EXPLORER,
    symbol: "BNB",
    name: "BSC",
    type: "main",
    label: "BNB_MAIN",
    decimals: 18,
  },
  66: {
    rpc: OKT_MAINNET,
    chainID: OKT_MAIN_CHAINID,
    lookHash: OKT_MAIN_EXPLORER + "/tx/",
    lookAddr: OKT_MAIN_EXPLORER + "/address/",
    explorer: OKT_MAIN_EXPLORER,
    symbol: "OKT",
    name: "OKExChain",
    type: "main",
    label: "OKT_MAIN",
    decimals: 18,
  },
  70: {
    rpc: HOO_MAINNET,
    chainID: HOO_MAIN_CHAINID,
    lookHash: HOO_MAIN_EXPLORER + "/txn?hash=",
    lookAddr: HOO_MAIN_EXPLORER + "/address?address=",
    explorer: HOO_MAIN_EXPLORER,
    symbol: "HOO",
    name: "HSC",
    type: "main",
    label: "HOO_MAIN",
    decimals: 18,
  },
  128: {
    rpc: HT_MAINNET,
    chainID: HT_MAIN_CHAINID,
    lookHash: HT_MAIN_EXPLORER + "/tx/",
    lookAddr: HT_MAIN_EXPLORER + "/address/",
    explorer: HT_MAIN_EXPLORER,
    symbol: "HT",
    name: "Huobi",
    type: "main",
    label: "HT_MAIN",
    decimals: 18,
  },
  256: {
    rpc: HT_TESTNET,
    chainID: HT_TEST_CHAINID,
    lookHash: HT_TEST_EXPLORER + "/tx/",
    lookAddr: HT_TEST_EXPLORER + "/address/",
    explorer: HT_TEST_EXPLORER,
    symbol: "HT",
    name: "Huobi",
    type: "test",
    label: "HT_TEST",
    decimals: 18,
  },
};
