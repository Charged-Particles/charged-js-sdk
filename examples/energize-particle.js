import Charged, { mainnetAddresses } from '@charged-particles/charged-js-sdk';

async function main() {
  const signer = await hre.ethers.getSigner();

  const charged = new Charged({ providers: ethers.provider, signer });
  const ionx = charged.erc20(mainnetAddresses.ionx.address);

  // Approve token usage to charge particles contract
  const approveTx = await ionx.approve(
    mainnetAddresses.chargedParticles.address, 
    hre.ethers.utils.parseUnits('1')
  );
  await approveTx.wait();

  const particleBAddress = mainnetAddresses.protonB.address;
  const tokenId = 1;
  const nft = charged.NFT(particleBAddress, tokenId);

  const txEnergize = await nft.energize(
    mainnetAddresses.ionx.address,
    hre.ethers.utils.BigNumber.from(1),
    'aave.B',
  );
  await txEnergize.wait();

  // Log energized amount
  const energizeStatus = await nft.getMass(daiMainnetAddress, 'aave.B');
  console.log(energizeStatus);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
