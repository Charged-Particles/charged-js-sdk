require("@nomiclabs/hardhat-ethers");

module.exports = {
  networks: {
    hardhat: {
      mining: {
        auto: true,
      },
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/onL35MUKZeTnQ3XZ3K_fbyg4ZcDyAbu5",
        blockNumber: 15187166,
      },
      accounts: {
        count: 2,
      },
    }
  },
};
