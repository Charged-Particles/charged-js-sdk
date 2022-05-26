import { ethers, providers, Signer } from 'ethers';
import { Networkish } from "@ethersproject/networks";


export type DefaultProviderKeys = {
  etherscan?: string;
  infura?: string;
  alchemy?: string;
};
  
export type MultiProvider = providers.JsonRpcProvider | providers.Provider;

export type MultiSigner = ethers.Signer |ethers.VoidSigner | ethers.Wallet | providers.JsonRpcSigner;

export type Configuration = {
  network: Networkish;
  provider: providers.Provider | undefined;
  signer?: Signer  | undefined;
};

export type constructorParams = {
  network?: Networkish,
  provider?: providers.Provider | providers.ExternalProvider | string,
  signer?: Signer,
  defaultProviderKeys?: DefaultProviderKeys
}