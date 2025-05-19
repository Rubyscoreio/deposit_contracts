import config from "./config";

const accounts = [config.DEPLOYER_KEY];

const networks = [
  {
    name: "zkEVMMainnet",
    chainId: 1101,
    apiKey: config.POLYGONZKSCAN_API_KEY,
    networkData: {
      url: `https://zkevm-rpc.com`,
      accounts,
    },
    urls: {
      apiURL: "https://explorer.mainnet.zkevm-test.net/api",
      browserURL: "https://explorer.mainnet.zkevm-test.net/",
    },
  },
  {
    name: "zkEVMTestnet",
    chainId: 1442,
    apiKey: config.POLYGONZKSCAN_API_KEY,
    networkData: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts,
    },
    urls: {
      apiURL: "https://testnet-zkevm.polygonscan.com/api",
      browserURL: "https://testnet-zkevm.polygonscan.com",
    },
  },
  {
    name: "scrollSepolia",
    chainId: 534351,
    apiKey: config.SCROLLSCAN_API_KEY,
    networkData: {
      url: "https://sepolia-rpc.scroll.io",
      accounts,
    },
    urls: {
      apiURL: "https://api-sepolia.scrollscan.com/api",
      browserURL: "https://sepolia.scrollscan.com",
    },
  },
  {
    name: "scrollMainnet",
    chainId: 534352,
    apiKey: config.SCROLLSCAN_API_KEY,
    networkData: {
      url: "https://rpc.scroll.io/",
      accounts,
    },
    urls: {
      apiURL: "https://api.scrollscan.com/api",
      browserURL: "https://scrollscan.com/",
    },
  },
  {
    name: "optimismMainnet",
    chainId: 10,
    apiKey: config.OPTIMIZM_API_KEY,
    networkData: {
      url: "https://mainnet.optimism.io",
      accounts,
    },
    urls: {
      apiURL: "https://api-optimistic.etherscan.io/api",
      browserURL: "https://explorer.optimism.io",
    },
  },
  {
    name: "optimismGoerli",
    chainId: 420,
    apiKey: config.OPTIMIZM_API_KEY,
    networkData: {
      url: "https://optimism-goerli.publicnode.com",
      accounts,
    },
    urls: {
      apiURL: "https://api-goerli-optimistic.etherscan.io/",
      browserURL: "https://goerli-explorer.optimism.io",
    },
  },
  {
    name: "mainnet",
    chainId: 1,
    apiKey: config.ETHERSCAN_API_KEY,
    networkData: {
      url: `https://mainnet.infura.io/v3/${config.INFURA_KEY}`,
      accounts,
    },
  },
  {
    name: "baseMainnet",
    chainId: 8453,
    apiKey: config.BASESCAN_API_KEY,
    networkData: {
      url: "https://mainnet.base.org",
      accounts,
    },
    urls: {
      apiURL: "https://api.basescan.org/api",
      browserURL: "https://basescan.org",
    },
  },
  {
    name: "baseGoerli",
    chainId: 84531,
    apiKey: config.BASESCAN_API_KEY,
    networkData: {
      url: "https://goerli.base.org",
      accounts,
      gasPrice: 1000000000,
    },
    urls: {
      apiURL: "https://api-goerli.basescan.org/api",
      browserURL: "https://goerli.basescan.org",
    },
  },
  {
    name: "lineaTestnet",
    chainId: 59140,
    apiKey: config.LINEASCAN_API_KEY,
    networkData: {
      url: `https://rpc.goerli.linea.build/`,
      accounts,
      gasPrice: 1000000007,
    },
    urls: {
      apiURL: "https://api-testnet.lineascan.build/api",
      browserURL: "https://goerli.lineascan.build/address",
    },
  },
  {
    name: "lineaMainnet",
    chainId: 59144,
    apiKey: config.LINEASCAN_API_KEY,
    networkData: {
      url: `https://linea-mainnet.infura.io/v3/${config.INFURA_KEY}`,
      accounts,
    },
    urls: {
      apiURL: "https://api.lineascan.build/api",
      browserURL: "https://lineascan.build/",
    },
  },
  {
    name: "zoraGoerli",
    chainId: 999,
    apiKey: config.ZORASCAN_API_KEY,
    networkData: {
      url: "https://testnet.rpc.zora.energy/",
      accounts,
      gasPrice: 2000000008,
    },
    urls: {
      apiURL: "https://testnet.explorer.zora.energy/api",
      browserURL: "https://testnet.explorer.zora.energy",
    },
  },
  {
    name: "zoraMainnet",
    chainId: 7777777,
    apiKey: config.ZORASCAN_API_KEY,
    networkData: {
      url: "https://rpc.zora.energy/",
      accounts,
    },
    urls: {
      apiURL: "https://explorer.zora.energy/api",
      browserURL: "https://explorer.zora.energy",
    },
  },
  {
    name: "goerli",
    chainId: 5,
    apiKey: config.ETHERSCAN_API_KEY,
    networkData: {
      url: `https://goerli.infura.io/v3/${config.INFURA_KEY}`,
      accounts,
    },
  },
  {
    name: "polygon",
    chainId: 137,
    apiKey: config.POLYGONSCAN_API_KEY,
    networkData: {
      url: `https://polygon-mainnet.infura.io/v3/${config.INFURA_KEY}`,
      accounts,
    },
  },
  {
    name: "polygonMumbai",
    chainId: 80001,
    apiKey: config.POLYGONSCAN_API_KEY,
    networkData: {
      url: `https://rpc-mumbai.maticvigil.com/`,
      accounts,
    },
  },
  {
    name: "bsc",
    chainId: 56,
    apiKey: config.BSCSCAN_API_KEY,
    networkData: {
      url: "https://bsc-dataseed.binance.org/",
      accounts,
    },
  },
  {
    name: "bscTestnet",
    chainId: 97,
    apiKey: config.BSCSCAN_API_KEY,
    networkData: {
      url: "https://bsc-testnet.public.blastapi.io",
      accounts,
    },
  },
  {
    name: "mantaMainnet",
    chainId: 169,
    apiKey: config.MANTASCAN_API_KEY,
    networkData: {
      url: "https://pacific-rpc.manta.network/http",
      accounts,
    },
    urls: {
      apiURL: "https://pacific-explorer.manta.network/api",
      browserURL: "https://pacific-explorer.manta.network",
    },
  },
  {
    name: "mantaTestnet",
    chainId: 3441005,
    apiKey: config.MANTASCAN_API_KEY,
    networkData: {
      url: "https://manta-testnet.calderachain.xyz/http",
      accounts,
    },
    urls: {
      apiURL: "https://pacific-explorer.testnet.manta.network/api",
      browserURL: "https://pacific-explorer.testnet.manta.network",
    },
  },
  {
    name: "mantleMainnet",
    chainId: 5000,
    apiKey: config.MANTLESCAN_API_KEY,
    urls: {
      apiURL: "https://api.mantlescan.xyz/api",
      browserURL: "https://api.mantlescan.xyz",
    },
  },
  {
    name: "mantleTestnet",
    chainId: 5003,
    apiKey: config.MANTLESCAN_API_KEY,
    urls: {
      apiURL: "https://explorer.sepolia.mantle.xyz/api",
      browserURL: "https://explorer.sepolia.mantle.xyz/",
    },
  },
  {
    name: "taikoTestnet",
    chainId: 167008,
    apiKey: config.TAIKOSCAN_API_KEY,
    networkData: {
      url: `https://rpc.katla.taiko.xyz`,
      accounts,
    },
    urls: {
      apiURL: "https://blockscoutapi.katla.taiko.xyz/api",
      browserURL: "https://blockscoutapi.katla.taiko.xyz/",
    },
  },
  {
    name: "berachainTestnet",
    chainId: 80085,
    apiKey: config.BERACHAINSCAN_API_KEY,
    networkData: {
      url: `https://artio.rpc.berachain.com/`,
      accounts,
    },
    urls: {
      apiURL: "https://api.routescan.io/v2/network/testnet/evm/80085/etherscan",
      browserURL: "https://artio.beratrail.io",
    },
  },
  {
    name: "morphMainnet",
    chainId: 2818,
    apiKey: "ANYTHING",
    networkData: {
      url: `https://rpc.morphl2.io`,
      accounts,
      gasPrice: 2000000,
    },
    urls: {
      apiURL: "https://explorer-api.morphl2.io/api?",
      browserURL: "https://explorer.morphl2.io/",
    },
  },
  {
    name: "morphHolesky",
    chainId: 2810,
    apiKey: "ANYTHING",
    networkData: {
      url: `https://virtual.polygon.rpc.tenderly.co/366fabc0-d7cc-454d-b11a-3525c6694f12`,
      accounts,
      gasPrice: 1_000_000_000,
    },
    urls: {
      apiURL: "https://explorer.morphl2.io/api",
      browserURL: "https://virtual.polygon.rpc.tenderly.co/c8198fa6-33d8-432e-95d1-e66482284cf7",
    },
  },
  {
    name: "reddioTestnet",
    chainId: 50341,
    apiKey: config.REDDIO_API_KEY,
    networkData: {
      url: `https://reddio-dev.reddio.com/`,
      accounts,
    },
    urls: {
      apiURL: "https://reddio-devnet.l2scan.co/api/",
      browserURL: "https://reddio-devnet.l2scan.co",
    },
  },
  {
    name: "soneiumMainnet",
    chainId: 1868,
    apiKey: "ANYTHING",
    networkData: {
      url: `https://soneium.drpc.org`,
      accounts,
    },
    urls: {
      apiURL: "https://soneium.blockscout.com/api",
      browserURL: "https://soneium.blockscout.com",
    },
  },
  {
    name: "soneiumTestnet",
    chainId: 1946,
    apiKey: "ANYTHING",
    networkData: {
      url: `https://rpc.minato.soneium.org`,
      accounts,
    },
    urls: {
      apiURL: "https://explorer.morphl2.io/api",
      browserURL: "https://soneium-minato.blockscout.com",
    },
  },
  {
    name: "monadTestnet",
    chainId: 10143,
    apiKey: "ANYTHING",
    networkData: {
      url: `https://testnet-rpc.monad.xyz/`,
      accounts,
    },
    urls: {
      apiURL: "https://sourcify-api-monad.blockvision.org",
      browserURL: "https://testnet.monadexplorer.com",
    },
  },
  {
    name: "somniaTestnet",
    chainId: 50312,
    apiKey: "ANYTHING",
    networkData: {
      url: `https://rpc.ankr.com/somnia_testnet/6e3fd81558cf77b928b06b38e9409b4677b637118114e83364486294d5ff4811`,
      accounts,
    },
    urls: {
      apiURL: "https://somnia-poc.w3us.site/api",
      browserURL: "https://somnia-poc.w3us.site",
    },
  },
  {
    name: "megaEthTestnet",
    chainId: 6342,
    apiKey: "ANYTHING",
    networkData: {
      url: `https://carrot.megaeth.com/rpc`,
      accounts,
    },
    urls: {
      apiURL: "",
      browserURL: "https://megaexplorer.xyz",
    },
  },
  {
    name: "riseTestnet",
    chainId: 11155931,
    apiKey: "ANYTHING",
    networkData: {
      url: `https://testnet.riselabs.xyz/`,
      accounts,
    },
    urls: {
      apiURL: "https://explorer.testnet.riselabs.xyz/api",
      browserURL: "https://explorer.testnet.riselabs.xyz/",
    },
  },
  {
    name: "bobaEthMainnet",
    chainId: 288,
    apiKey: "ANYTHING",
    networkData: {
      url: `https://mainnet.boba.network`,
      accounts,
    },
    urls: {
      apiURL: "https://api.routescan.io/v2/network/mainnet/evm/288/etherscan",
      browserURL: "https://bobascan.com",
    },
  },
];

export default networks;
