import Charged, { mainnetAddresses } from '@charged-particles/charged-js-sdk';

async function main() {
  const signer = await hre.ethers.getSigner();

  const charged = new Charged({ providers: ethers.provider, signer });
  const ionx = charged.erc20(mainnetAddresses.ionx.address);

  const approveTx = await ionx.approve(signer.address, hre.ethers.utils.parseUnits('1'));
  await approveTx.wait();

  const particleBAddress = mainnetAddresses.protonB.address;
  const tokenId = 1;
  const nft = charged.NFT(particleBAddress, tokenId);

  const txEnergize = await nft.energize(
    daiMainnetAddress,
    hre.ethers.utils.BigNumber.from(1),
    'aave.B',
  );
  await txEnergize.wait();

  // Log energized amount
  const energizeStatus = await nft.getMass(daiMainnetAddress, 'aave.B');
  console.log(energizeStatus);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
