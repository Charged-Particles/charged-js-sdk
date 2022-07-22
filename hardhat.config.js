require("@nomiclabs/hardhat-ethers");
require('dotenv/config');

module.exports = {
  networks: {
    hardhat: {
      mining: {
        auto: true,
      },
      forking: {
        url: process.env['RPC_URL_MAINNET'],
        blockNumber: 15187166,
      },
      accounts: {
        count: 2,
      },
    }
  },
};
