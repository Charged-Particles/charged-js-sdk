import { ethers } from 'ethers';
import { Networkish, Network} from '@ethersproject/networks';

// ------------------------------------------------------------------------
// TODO: move this into globals
// ------------------------------------------------------------------------
// alchemy rpcUrls
const polygon_rpc_url_alchemy ="https://polygon-{chainName}.g.alchemy.com/v2/{apiKey}";
const ethereum_rpc_url_alchemy ="https://eth-{chainName}.alchemyapi.io/v2/{apiKey}";
// infura rpcUrls
const polygon_rpc_url_infura = "https://polygon-{chainName}.infura.io/v3/{apiKey}";
const ethereum_rpc_url_infura = "https://{chainName}.infura.io/v3/{apiKey}";
// etherscan rpcUrls
const rpc_url_etherscan = "";
// ------------------------------------------------------------------------

export const getRpcNetwork = (chainId: number, rpcUrl: string): Network => {
   const rpcProvider: Network = {
     name: getAddressFromNetwork(chainId),
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

   let chainName: string = getAddressFromNetwork(network);
   if (chainName == 'polygon') {                         // To craft the correct url for polygon mainnet rpcUrl edge-case
      chainName = 'mainnet';
   }

   switch(providerName) {
      case 'alchemy':
         if (connectedToPolygon) {
            rpcUrl = polygon_rpc_url_alchemy;
         } else {
            rpcUrl = ethereum_rpc_url_alchemy;
         }
         apiKey = service.alchemy;
         break;
      case 'infura':
         if (connectedToPolygon) {
            rpcUrl = polygon_rpc_url_infura;
         } else {
            rpcUrl = ethereum_rpc_url_infura;
         }
         apiKey = service.infura;
         break;
      case 'etherscan':
         rpcUrl = rpc_url_etherscan;
         apiKey = service.etherscan;
         break;
   }

   return rpcUrl.replace('{chainName}', chainName).replace('{apiKey}', apiKey);
}

export const getDefaultProviderByNetwork = (network: number, service: any): ethers.providers.BaseProvider => {
   const rpcUrl = getRpcUrl(network, service);
   const defaultProvider: ethers.providers.BaseProvider = ethers.getDefaultProvider(getRpcNetwork(network, rpcUrl));
   // should we reintroduce ethers.getDefaultProvider(network, service) for the !connectedToPolygon case???
   console.log({defaultProvider});
   return defaultProvider;
}
 
// Charged Particles is only deployed on Mainnet, Kovan, Polygon, and Mumbai
export const getAddressFromNetwork = (network?:Networkish) => {
  // if network is not given. default to mainnet
  if(!network) { return 'mainnet' };

  if(typeof network === "string") {
     switch(network) {
        case 'homestead': return 'mainnet';
        case 'kovan': return 'kovan';
        case 'matic': return 'polygon';
        case 'polygon': return 'polygon';
        case 'maticmum': return 'mumbai';
        case 'mumbai': return 'mumbai';
        default: throw 'unsupported chain given to getAddressFromNetwork';
     }
  } else if(typeof network === "number") {
     switch(network) {
        case 1: return 'mainnet';
        case 42: return 'kovan';
        case 137: return 'polygon';
        case 80001: return 'mumbai';
        default: throw 'unsupported chain given to getAddressFromNetwork';
     }
  } else {
     // network is a Network type object here. See ethers doc for more info.
     switch(network.chainId) {
        case 1: return 'mainnet';
        case 42: return 'kovan';
        case 137: return 'polygon';
        case 80001: return 'mumbai';
        default: throw 'unsupported chain given to getAddressFromNetwork';
     }
  }
}

export const SUPPORTED_NETWORKS = [
  {chainId:     1, chainName: 'eth', name: 'Ethereum'},
  {chainId:    42, chainName: 'kovan', name: 'Ethereum (Kovan)'},
  {chainId:   137, chainName: 'polygon', name: 'Polygon'},
  {chainId: 80001, chainName: 'mumbai',  name: 'Polygon (Mumbai)'},
];