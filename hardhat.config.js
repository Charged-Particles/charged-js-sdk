require("@nomiclabs/hardhat-ethers");
require('dotenv/config');

module.exports = {
  networks: {
    hardhat: {
      chainId: 1,
      mining: {
        auto: true,
      },
      forking: {
        url: process.env['RPC_URL_MAINNET'],
        blockNumber: 15194000,
      },
      accounts: {
        mnemonic: process.env['MNEMONIC'],
        count: 1,
      },
    },
    goerli: {
      chainId: 5,
      url: process.env['RPC_URL_GOERLI'],
      accounts: {
        mnemonic: process.env['MNEMONIC'],
        count: 1,
      },
    }
  },
};
