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
  configuration: ConfigurationParameters;
};

export type managerId = 'aave' | 'aave.B' | 'generic' | 'generic.B';

export type ConfigurationParameters = {
  sdk?: SdkConfiguration,
  transactionOverride?: TransactionOverride
}

export type SdkConfiguration = {
  NftBridgeCheck: boolean
}

export type TransactionOverride = {
  from?: string,
  value?: any,
  gasPrice?: any,
  gasLimit?: any,
  blockTag?: any,
  nonce?: any
}