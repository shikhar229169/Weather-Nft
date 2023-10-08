/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("./tasks/change-source-code")
require("./tasks/change-secrets")
require("dotenv").config();

PRIVATE_KEY = process.env.PRIVATE_KEY;
SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL

module.exports = {
  solidity: "0.8.19",

  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },

  defaultNetwork: "hardhat",

  networks: {
    hardhat: {},
    
    sepolia: {
      chainId: 11155111,
      accounts: [PRIVATE_KEY],
      url: SEPOLIA_RPC_URL,
    },

    mumbai: {
      chainId: 80001,
      accounts: [PRIVATE_KEY],
      url: MUMBAI_RPC_URL
    }
  },

  namedAccounts: {
    deployer: {
      default: 0,
    },
    player : {
      default: 1
    }
  },

  gasReporter: {
    enabled: false
  },

  mocha: {
    timeout: 300000
  }
};
