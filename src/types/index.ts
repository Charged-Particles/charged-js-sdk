import { ethers, providers, Signer } from 'ethers';

export type MultiProvider = providers.JsonRpcProvider | providers.Provider;

export type MultiSigner = ethers.Signer | ethers.VoidSigner | ethers.Wallet | providers.JsonRpcSigner;

export type DefaultProviderKeys = {
  etherscan?: string;
  infura?: string;
  alchemy?: string;
};

export type NetworkProvider = {
  network: number,
  service: { [index: string]: string | undefined }
}

export type ChargedState = {
  providers?: any;
  signer?: Signer;
};

export type managerId = 'aave' | 'aave.B' | 'generic' | 'generic.B';