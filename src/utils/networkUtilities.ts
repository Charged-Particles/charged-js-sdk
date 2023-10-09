import { ethers } from 'ethers';
import { Network } from '@ethersproject/networks';
import {
  alchemyEthereumRpcUrl,
  alchemyPolygonRpcUrl,
  etherscanEthereumRpcUrl,
  infuraEthereumRpcUrl,
  infuraPolygonRpcUrl
} from './config';

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
        rpcUrl = alchemyPolygonRpcUrl;
      } else {
        rpcUrl = alchemyEthereumRpcUrl;
      }
      apiKey = service.alchemy;
      break;
    case 'infura':
      if (connectedToPolygon) {
        rpcUrl = infuraPolygonRpcUrl;
      } else {
        rpcUrl = infuraEthereumRpcUrl;
      }
      apiKey = service.infura;
      break;
    case 'etherscan':
      rpcUrl = etherscanEthereumRpcUrl;
      apiKey = service.etherscan;
      break;

    case 'rpc': return service.rpc;

  }

  return rpcUrl.replace('{chainName}', chainName).replace('{apiKey}', apiKey);
}

export const getDefaultProviderByNetwork = (network: number, service: any): ethers.providers.BaseProvider => {
  const rpcUrl = getRpcUrl(network, service);
  const defaultProvider: ethers.providers.BaseProvider = ethers.getDefaultProvider(getRpcNetwork(network, rpcUrl));
  return defaultProvider;
}

export const getChainNameById = (network?: number) => {
  // if network is not given. default to mainnet
  if(!network) { return 'mainnet' };
  switch(network) {
    case 1: return 'mainnet';
    case 5: return 'goerli';
    case 42: return 'kovan';
    case 137: return 'polygon';
    case 5000: return 'mantle';
    case 5001: return 'mantleTestnet';
    case 80001: return 'mumbai';
    default: throw `network id: ${network} is not valid in getAddressFromNetwork`;
	}
}

export const SUPPORTED_NETWORKS = [
  { chainId: 1, chainName: 'eth', name: 'Ethereum' },
  { chainId: 5, chainName: 'goerli', name: 'Goerli' },
  { chainId: 42, chainName: 'kovan', name: 'Ethereum (Kovan)' },
  { chainId: 5001, chainName: 'mantleTestnet', name: 'Mantle testnet' },
  { chainId: 137, chainName: 'polygon', name: 'Polygon' },
  { chainId: 80001, chainName: 'mumbai', name: 'Polygon (Mumbai)' },
];