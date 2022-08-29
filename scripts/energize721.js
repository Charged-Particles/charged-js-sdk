const hre = require('hardhat');
const { default: Charged, goerliAddresses, protonBAbi } = require('../dist/index')

async function main() {
  const signer = await hre.ethers.getSigner();

  // Give permit to the charged contract.
  // const depositedNft = new hre.ethers.Contract('0x07bc6CeEe891E66395277618d2859AEdeB21d262', protonBAbi, signer);
  // const depositedNftConnected = depositedNft.connect(hre.ethers.provider);
  // const approveTx = await depositedNft.approve(goerliAddresses.chargedParticles.address, 1);
  // await approveTx.wait();
  
  const charged = new Charged({providers: hre.ethers.provider, signer});
  const nft = charged.NFT('0x894fe586f4be12cdb5d107323a2f5182161c3515', 6);
  // const bondTx = await nft.bond('0x07bc6CeEe891E66395277618d2859AEdeB21d262', '1', '1', 'generic.B');
  // const bondReceipt = await bondTx.wait();
  // console.log(bondReceipt);

  console.log(await nft.getBonds());


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
