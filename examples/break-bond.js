import Charged, { mainnetAddresses } from '@charged-particles/charged-js-sdk';

async function main() {
  const signer = await hre.ethers.getSigner();

  const charged = new Charged({ providers: ethers.provider, signer });
  const nft = charged.NFT(mainnetAddresses.proton.address, 458);

  const bondBalanceBeforeBreak = await nft.getBonds('generic');
  console.log(bondBalanceBeforeBreak) // 2

  const breakBondTrx = await nft.breakBond(
    myWallet.address,
    '0x60f80121c31a0d46b5279700f9df786054aa5ee5',
    '1095782',
    1,
    'generic',
    1
  );

  await breakBondTrx.wait();
  const bondBalanceAfterBreak = await nft.getBonds('generic');
  console.log(bondBalanceAfterBreak); // 1
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
