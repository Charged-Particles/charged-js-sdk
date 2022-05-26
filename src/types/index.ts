import { ethers, providers } from 'ethers';

export type DefaultProviderKeys = {
    etherscan?: string;
    infura?: string;
    alchemy?: string;
  };
  
export type MultiProvider = providers.JsonRpcProvider | providers.Provider;

export type MultiSigner = ethers.Signer |ethers.VoidSigner | ethers.Wallet | providers.JsonRpcSigner;
