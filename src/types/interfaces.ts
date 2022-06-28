import { Provider } from '@ethersproject/providers';
import { Signer, Contract } from 'ethers';

export interface ContractsFactory {
  connect: (address: string, provider?: Provider, signer?: Signer) => Contract;
}

export type ContractLocation = {
  address: string,
  startBlock: string
}

export interface NetworkContractLocations {
  [contract: string]: ContractLocation | string,
  network: string,
}