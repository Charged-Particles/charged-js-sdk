import { Provider } from '@ethersproject/providers';
import { Signer, Contract } from 'ethers';

export interface ContractsFactory {
  connect: (address: string, provider?: Provider, signer?: Signer) => Contract;
}

export type ContractLocation = {
  address: string,
  startBlock: string
}

export interface swagasf {
  [network: number]: {
    [contract: string]: {
      address: string,
      startBlock: string
    }
  }
}

export interface butthole {

}

export interface NetworkContractLocations {
  [contract: string]: ContractLocation | string,
  network: string,
}

// CAN DELETE ALOT OF THESE ONE WE GET THEM FROM GRAPH
export type NetworkUniverseJSON = {
  network: string,
  universe: ContractLocation,
  chargedState: ContractLocation,
  chargedSettings: ContractLocation,
  chargedManagers: ContractLocation,
  chargedParticles: ContractLocation,
  genericWalletManager: ContractLocation,
  genericBasketManager: ContractLocation,
  aaveWalletManager: ContractLocation,
  genericWalletManagerB: ContractLocation,
  genericBasketManagerB: ContractLocation,
  aaveWalletManagerB: ContractLocation,
  particleSplitter: ContractLocation,
  proton: ContractLocation,
  protonB: ContractLocation,
  lepton: ContractLocation,
  lepton2: ContractLocation,
  ionx: ContractLocation,
  wBoson: ContractLocation,
  externalERC721?: ContractLocation,
  nonFungibleERC1155?: ContractLocation,
  fungibleERC1155?: ContractLocation,
  communityVault?: ContractLocation,
  uniEthIonxLpToken?: ContractLocation,
  staking?: ContractLocation,
  ionxYieldFarm?: ContractLocation,
  lpYieldFarm?: ContractLocation,
  staking2?: ContractLocation,
  ionxYieldFarm2?: ContractLocation,
  lpYieldFarm2?: ContractLocation,
  staking3?: ContractLocation,
  ionxYieldFarm3?: ContractLocation,
  lpYieldFarm3?: ContractLocation,
  merkleDistributor?: ContractLocation,
  merkleDistributor2?: ContractLocation,
  merkleDistributor3?: ContractLocation,
  vestingClaim?: ContractLocation,
  vestingClaim2?: ContractLocation,
  vestingClaim3?: ContractLocation,
  vestingClaim4?: ContractLocation,
  vestingClaim5?: ContractLocation,
  vestingClaim6?: ContractLocation,
  vestingClaim7?: ContractLocation,
  particlon?: ContractLocation,
}

