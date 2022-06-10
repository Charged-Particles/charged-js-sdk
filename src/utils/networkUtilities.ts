import { ethers } from 'ethers';
import { Network } from '@ethersproject/networks';

// ------------------------------------------------------------------------
// TODO: move this into globals
// ------------------------------------------------------------------------
// alchemy rpcUrls
const polygonRpcUrlAlchemy = "https://polygon-{chainName}.g.alchemy.com/v2/{apiKey}";
const ethereumRpcUrlAlchemy = "https://eth-{chainName}.alchemyapi.io/v2/{apiKey}";

// infura rpcUrls
const polygonRpcUrlInfura = "https://polygon-{chainName}.infura.io/v3/{apiKey}";
const ethereumRpcUrlInfura = "https://{chainName}.infura.io/v3/{apiKey}";

// etherscan rpcUrls
const rpcUrlEtherscan = "";
// ------------------------------------------------------------------------

export const getRpcNetwork = (chainId: number, rpcUrl: string): Network => {
  const rpcProvider: Network = {
    name: getChainNameById(chainId),
    chainId,
    _defaultProvider: (providers) => new providers.JsonRpcProvider(rpcUrl)
  }
  return rpcProvider;
}

export const getRpcUrl = (network: number, service: any): string => {
  let apiKey: string = '';
  let rpcUrl: string = '';

  const providerName: string = Object.keys(service)[0];
  const connectedToPolygon: boolean = network == 137 || network == 80001;

  let chainName: string = getChainNameById(network);
  
  // Craft the correct url for polygon mainnet rpcUrl edge-case
  if (chainName == 'polygon') { chainName = 'mainnet' };

  switch (providerName) {
    case 'alchemy':
      if (connectedToPolygon) {
        rpcUrl = polygonRpcUrlAlchemy;
      } else {
        rpcUrl = ethereumRpcUrlAlchemy;
      }
      apiKey = service.alchemy;
      break;
    case 'infura':
      if (connectedToPolygon) {
        rpcUrl = polygonRpcUrlInfura;
      } else {
        rpcUrl = ethereumRpcUrlInfura;
      }
      apiKey = service.infura;
      break;
    case 'etherscan':
      rpcUrl = rpcUrlEtherscan;
      apiKey = service.etherscan;
      break;
  }

  return rpcUrl.replace('{chainName}', chainName).replace('{apiKey}', apiKey);
}

export const getDefaultProviderByNetwork = (network: number, service: any): ethers.providers.BaseProvider => {
  const rpcUrl = getRpcUrl(network, service);
  const defaultProvider: ethers.providers.BaseProvider = ethers.getDefaultProvider(getRpcNetwork(network, rpcUrl));
  // should we reintroduce ethers.getDefaultProvider(network, service) for the !connectedToPolygon case???

  return defaultProvider;
}

export const getChainNameById = (network?: number) => {
  // if network is not given. default to mainnet
  if(!network) { return 'mainnet' };
  switch(network) {
    case 1: return 'mainnet';
    case 42: return 'kovan';
    case 137: return 'polygon';
    case 80001: return 'mumbai';
    default: throw `network id: ${network} is not valid in getAddressFromNetwork`;
	}
}

export const SUPPORTED_NETWORKS = [
  { chainId: 1, chainName: 'eth', name: 'Ethereum' },
  { chainId: 42, chainName: 'kovan', name: 'Ethereum (Kovan)' },
  { chainId: 137, chainName: 'polygon', name: 'Polygon' },
  { chainId: 80001, chainName: 'mumbai', name: 'Polygon (Mumbai)' },
];