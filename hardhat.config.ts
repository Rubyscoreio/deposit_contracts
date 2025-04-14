import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "solidity-docgen";
import "@nomicfoundation/hardhat-foundry";

import "tsconfig-paths/register";

import "./tasks/index";

import networks from "./networks";
import { ApiKey, ChainConfig } from "@nomicfoundation/hardhat-verify/types";
import { NetworksUserConfig } from "hardhat/types";

const externalNetworks: NetworksUserConfig = {};
networks
  .filter((network) => network.networkData)
  .forEach((network) => {
    externalNetworks[network.name] = {
      chainId: network.chainId,
      ...network.networkData,
    };
  });

const apiKeys: ApiKey = {};
networks.forEach((network) => {
  apiKeys[network.name] = network.apiKey;
});

function typedNamedAccounts<T>(namedAccounts: { [key in string]: T }) {
  return namedAccounts;
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.21",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      metadata: {
        bytecodeHash: "none",
        useLiteralContent: true,
      },
    },
  },
  typechain: {
    outDir: "types/typechain-types",
  },
  networks: {
    hardhat: {
      gasPrice: 10000000,
      loggingEnabled: false,
      forking: {
        url: `https://rpc-quicknode-holesky.morphl2.io`,
        enabled: true,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    ...externalNetworks,
  },
  sourcify: {
    enabled: !process.env.USE_ETHERSCAN,
    apiUrl: "https://sourcify-api-monad.blockvision.org",
    browserUrl: "https://testnet.monadexplorer.com",
  },
  etherscan: {
    enabled: !!process.env.USE_ETHERSCAN,
    apiKey: apiKeys,
    customChains: networks
      .filter((network) => network.urls)
      .map(
        (network) =>
          ({
            network: network.name,
            chainId: network.chainId,
            urls: network.urls,
          }) as ChainConfig,
      ),
  },
  namedAccounts: typedNamedAccounts({
    deployer: 0,
    admin: "0x0d0D5Ff3cFeF8B7B2b1cAC6B6C27Fd0846c09361",
    operator: "0x381c031baa5995d0cc52386508050ac947780815",
  }),
  docgen: {
    exclude: ["./mocks"],
    pages: "files",
  },
  watcher: {
    test: {
      tasks: [{ command: "test", params: { testFiles: ["{path}"] } }],
      files: ["./test/**/*"],
      verbose: true,
    },
  },
  gasReporter: {
    enabled: !!process.env.ENABLE_GAS_REPORT,
    coinmarketcap: "4a3ee5e9-0cc5-4b90-8329-ae0e7b943075",
    currency: "USD",
    token: "ETH",
    gasPrice: 28,
  },
};

export default config;
