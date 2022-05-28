import { ethers, providers, Signer } from 'ethers';
import { Networkish } from "@ethersproject/networks";


export type DefaultProviderKeys = {
  etherscan?: string;
  infura?: string;
  alchemy?: string;
};

export type networkProvider = {
  network: number,
  service: any
}

export type MultiProvider = providers.JsonRpcProvider | providers.Provider;

export type MultiSigner = ethers.Signer |ethers.VoidSigner | ethers.Wallet | providers.JsonRpcSigner;

export type Configuration = {
  providers?: any;
  signer?: Signer;
};

export type constructorParams = {
  providers?: networkProvider[],  
  signer?: Signer,
};

export interface charged {
  network?: Networkish,
  provider?: providers.Provider | providers.ExternalProvider | string,
  signer?: Signer,
  defaultProviderKeys?: DefaultProviderKeys
}
