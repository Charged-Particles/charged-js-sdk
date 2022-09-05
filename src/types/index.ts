import { ethers, providers, Signer } from 'ethers';

export type MultiProvider = providers.JsonRpcProvider | providers.Provider;

export type MultiSigner = ethers.Signer | ethers.VoidSigner | ethers.Wallet | providers.JsonRpcSigner;

export type DefaultProviderKeys = {
  etherscan?: string;
  infura?: string;
  alchemy?: string;
};

/**
* User specified custom network provider.
*
* @typedef {Object} NetworkProvider
* @property {number} [network] - Configure the SDK.
* @property { [index: string]: string | undefined} [service] - Service provider name and keys or specify a RPC URL.
*
* @example
*  const providers = [
*    {
*      network: 1,
*      service: { 'alchemy': process.env.ALCHEMY_MAINNET_KEY }
*    },
*    {
*      network: 42,
*      service: { 'infura': process.env.INFURA_KOVAN_KEY }
*    }
*  ];
*
* const rpcUrlProvider = [
*   {
*      network: 42,
*      service: { 'rpc': `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_SECRET}`}
*    }
*  ];
*
*/
export type NetworkProvider = {
  network: number,
  service: { [index: string]: string | undefined }
}

export type ChargedState = {
  providers?: any;
  signer?: Signer;
  configuration: ConfigurationParameters;
};

export type AddressByChain = {
  [chainId: number]: string;
};

/**
 * A string enum that identifies which wallet manager to use.
 * @typedef {WalletManagerId}
 * @property {string} ManagerId - possible values: `aave`, `aave.B`, `generic`, `generic.B`
 */
export type ManagerId = 'aave' | 'aave.B' | 'generic' | 'generic.B';

/**
 * A string enum that identifies which wallet manager to use.
 * @typedef {BasketManagerId}
 * @property {string} ManagerId - possible values: `generic`, `generic.B`
 */
export type BasketManagerId = 'generic' | 'generic.B';

export const defaultManagerId: ManagerId  = 'generic.B';

/**
* Charged class constructor object parameter.
* @typedef {Object} ConfigurationParameters
* @property {SdkConfiguration} [sdk] - Configure the SDK.
* @property {TransactionOverride} [transactionOverride] - Override transaction default values.
*/
export type ConfigurationParameters = {
  sdk?: SdkConfiguration,
  transactionOverride?: TransactionOverride
}

/**
* SDK configuration.
* @typedef {Object} SdkConfiguration
* @property {boolean} [NftBridgeCheck=false] - Verifies that the signer network matches the chainId of the contract interaction.
*/
export type SdkConfiguration = {
  NftBridgeCheck: boolean
}

/**
* Overrides {@link https://docs.ethers.io/v5/api/contract/contract/#Contract--metaclass ethers transaction} default parameters.
* @typedef {Object} TransactionOverride
* @property {string} [from]
* @property {number} [value]
* @property {number} [gasPrice]
* @property {number} [gasLimit]
* @property {number} [blockTag]
* @property {number} [nonce]
*/
export type TransactionOverride = {
  from?: string,
  value?: any,
  gasPrice?: any,
  gasLimit?: any,
  blockTag?: any,
  nonce?: any
}

export const walletManagerCheck = (managerId: ManagerId) => {
  const validWalletManagers = ['aave', 'aave.B', 'generic', 'generic.B'];
  if (!validWalletManagers.includes(managerId)) {throw new Error('Provided a not supported wallet manager id.')};
};

export const basketManagerCheck = (managerId: ManagerId) => {
  const validWalletManagers = ['generic', 'generic.B'];
  if (!validWalletManagers.includes(managerId)) {throw new Error('Provided a not supported basket manager id.')};
};