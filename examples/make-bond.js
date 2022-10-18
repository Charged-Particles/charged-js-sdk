import Charged,  { 
  protonBAbi, 
  mainnetAddresses 
} from '@charged-particles/charged-js-sdk';

async function main() {
  const signer = await hre.ethers.getSigner();

  // Initialize erc721 contract
  const erc721Contract = new ethers.Contract(
    mainnetAddresses.protonB.address, 
    protonBAbi, 
    signer
  );

  // Get bond proton id
  const bondProtonId = await erc721Contract.callStatic.createBasicProton(
    signer.address, // creator
    signer.address, // receiver
    'tokenUri.com', // tokenMetaUri
  );

  // Mint proton to be deposited
  const txCreateProton = await erc721Contract.createBasicProton(
    myWallet.address,
    myWallet.address,
    'tokenUri.com',
  );
  await txCreateProton.wait();
  
  // Give Charged Particle protocol approval over bond proton nft.
  const txApprove = await erc721Contract.approve(
    mainnetAddresses.chargedParticles.address, 
    bondProtonId.toString()
  );
  await txApprove.wait();

  // Initialize charged SDK
  const charged = new Charged({ providers: ethers.provider, signer });
  // Nft being deposited into.
  const nft = charged.NFT(mainnetAddresses.protonB.address, 1); 

  // Create bond
  const txBond = await nft.bond(
    mainnetAddresses.protonB.address,
    bondProtonId, 
    '1', // amount 
  );

  await txBond.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
