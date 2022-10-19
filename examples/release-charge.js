import Charged, { mainnetAddresses } from '@charged-particles/charged-js-sdk';

async function main() {
  const signer = await hre.ethers.getSigner();

  const charged = new Charged({ providers: ethers.provider, signer });
  const nft = charged.NFT(mainnetAddresses.protonB.address, 1);

  const releaseTransaction = nft.release(
    signer.address,
    'aave.B',
    mainnetAddresses.ionx.address
  ); 

  await releaseTransaction.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
