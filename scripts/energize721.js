const hre = require('hardhat');
const { default: Charged, kovanAddresses, protonBAbi } = require('../dist/index')

async function main() {
  const signer = await hre.ethers.getSigner();

  // Give permit to the charged contract.
  const depositedNft = new hre.ethers.Contract('0x1299B7236b43557F077f4BEBc417Ae96E0A82671', protonBAbi, signer);
  const approveTx = depositedNft.approve(kovanAddresses.chargedParticles.address, '1');
  await approveTx.wait();
  
  const charged = new Charged({providers: hre.ethers.provider, signer});
  const nft = charged.NFT('0xd1bce91a13089b1f3178487ab8d0d2ae191c1963', 57);
  const bondTx = await nft.bond('0x1299B7236b43557F077f4BEBc417Ae96E0A82671', '1', '1');
  const bondReceipt = await bondTx.wait();

  console.log(bondReceipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
