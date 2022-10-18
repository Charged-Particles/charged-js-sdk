import Charged,  { 
  protonBAbi, 
  mainnetAddresses 
} from '@charged-particles/charged-js-sdk';

async function main() {
  const signer = await hre.ethers.getSigner();

  const charged = new Charged({ providers: ethers.provider, signer });
  const nft = charged.NFT(mainnetAddresses.protonB.address, 1);

  // Mint proton
  const erc721Contract = new ethers.Contract(
    mainnetAddresses.protonB.address, 
    protonBAbi, 
    signer
  );

  // get proton id
  const protonId = await erc721Contract.callStatic.createBasicProton(
    signer.address,
    signer.address,
    'tokenUri.com',
  );

  // mint proton
  const txCreateProton = await erc721Contract.createBasicProton(
    myWallet.address,
    myWallet.address,
    'tokenUri.com',
  );
  await txCreateProton.wait();
  
  // Give Charged Particle protocol approval 
  const txApprove = await erc721Contract.approve(
    mainnetAddresses.chargedParticles.address, 
    protonId.toString()
  );

  await txApprove.wait();
  
  // Create bond
  const txBond = await nft.bond(
    mainnetAddresses.protonB.address,
    protonId,
    '1',
  );

  await txBond.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
