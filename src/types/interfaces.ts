import { Provider } from '@ethersproject/providers';
import { Signer, Contract } from 'ethers';

export interface ContractsFactory {
  connect: (address: string, provider?: Provider, signer?: Signer) => Contract;
}

type contractLocation = {
  address: string,
  startBlock: string
}

export interface slay {
  [contract: string]: contractLocation | string,
  network: string,
}

// CAN DELETE ALOT OF THESE ONE WE GET THEM FROM GRAPH
export type NetworkUniverseJSON = {
  network: string,
  universe: contractLocation,
  chargedState: contractLocation,
  chargedSettings: contractLocation,
  chargedManagers: contractLocation,
  chargedParticles: contractLocation,
  genericWalletManager: contractLocation,
  genericBasketManager: contractLocation,
  aaveWalletManager: contractLocation,
  genericWalletManagerB: contractLocation,
  genericBasketManagerB: contractLocation,
  aaveWalletManagerB: contractLocation,
  particleSplitter: contractLocation,
  proton: contractLocation,
  protonB: contractLocation,
  lepton: contractLocation,
  lepton2: contractLocation,
  ionx: contractLocation,
  wBoson: contractLocation,
  externalERC721?: contractLocation,
  nonFungibleERC1155?: contractLocation,
  fungibleERC1155?: contractLocation,
  communityVault?: contractLocation,
  uniEthIonxLpToken?: contractLocation,
  staking?: contractLocation,
  ionxYieldFarm?: contractLocation,
  lpYieldFarm?: contractLocation,
  staking2?: contractLocation,
  ionxYieldFarm2?: contractLocation,
  lpYieldFarm2?: contractLocation,
  staking3?: contractLocation,
  ionxYieldFarm3?: contractLocation,
  lpYieldFarm3?: contractLocation,
  merkleDistributor?: contractLocation,
  merkleDistributor2?: contractLocation,
  merkleDistributor3?: contractLocation,
  vestingClaim?: contractLocation,
  vestingClaim2?: contractLocation,
  vestingClaim3?: contractLocation,
  vestingClaim4?: contractLocation,
  vestingClaim5?: contractLocation,
  vestingClaim6?: contractLocation,
  vestingClaim7?: contractLocation,
  particlon?: contractLocation,
}

