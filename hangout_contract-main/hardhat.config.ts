import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: process.env.ROPSTEN_URL || "HTTP://127.0.0.1:8545",
      accounts: process.env.HARDHAT_PRIKEY !== undefined ? [process.env.HARDHAT_PRIKEY] : [],
    },
    rinkeby: {
      url: process.env.ROPSTEN_URL || "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: process.env.HARDHAT_PRIKEY !== undefined ? [process.env.HARDHAT_PRIKEY] : [],
    },
    goerli: {
      url: process.env.ROPSTEN_URL || "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: process.env.HARDHAT_PRIKEY !== undefined ? [process.env.HARDHAT_PRIKEY] : [],
    },
    heco: {
      url: process.env.ROPSTEN_URL || "https://http-mainnet.hecochain.com",
      accounts: process.env.HARDHAT_PRIKEY !== undefined ? [process.env.HARDHAT_PRIKEY] : [],
    },
    bsc: {
      url: process.env.ROPSTEN_URL || "https://bsc-dataseed1.defibit.io/",
      accounts: process.env.HARDHAT_PRIKEY !== undefined ? [process.env.HARDHAT_PRIKEY] : [],
    },
    ethtest: {
      url: process.env.ROPSTEN_URL || "https://mainnet.infura.io/v3/7088be0de3634b089eba674d7cae25f9",
      accounts: process.env.HARDHAT_PRIKEY !== undefined ? [process.env.HARDHAT_PRIKEY] : [],
    },
    ethereum: {
      url: process.env.ROPSTEN_URL || "https://mainnet.infura.io/v3/7088be0de3634b089eba674d7cae25f9",
      accounts: process.env.HARDHAT_PRIKEY !== undefined ? [process.env.HARDHAT_PRIKEY] : [],
    },
    polygon: {
      url: process.env.ROPSTEN_URL || "https://polygon-rpc.com",
      accounts: process.env.HARDHAT_PRIKEY !== undefined ? [process.env.HARDHAT_PRIKEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },

  mocha: {
    timeout: 600000,
  },
};

// set proxy
// const { ProxyAgent, setGlobalDispatcher } = require("undici");
// const proxyAgent = new ProxyAgent("http://127.0.0.1:1080");
// setGlobalDispatcher(proxyAgent);

export default config;
