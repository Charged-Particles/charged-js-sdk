const hre = require('hardhat');
const { default: Charged } = require('../dist/index')

async function main() {
  const signer = await hre.ethers.getSigner();
  
  const charged = new Charged({providers: hre.ethers.provider, signer});
  const nft = charged.NFT('0x894fe586f4be12cdb5d107323a2f5182161c3515', 6);

  const bondTx = await nft.bond('0x72AA786aB3AE498FE085D3A10bC8c639dB572731', '1', '1');
  const bondReceipt = await bondTx.wait();

  console.log(bondReceipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
