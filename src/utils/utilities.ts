import { Networkish, Network} from '@ethersproject/networks';
import { ethers } from 'ethers';

export const getMumbaiRpcProvider = (chainId: number, apiKey: string): Network => {
   const mumbaiRpcProvider: Network = {
     name: 'mumbai',
     chainId,
     _defaultProvider: (providers) => new providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`)
   }
   return mumbaiRpcProvider;
}
 
export const getPolygonRpcProvider = (chainId: number, apiKey: string): Network => {
   const polygonRpcProvider: Network = {
     name: 'polygon',
     chainId,
     _defaultProvider: (providers) => new providers.JsonRpcProvider(`https://polygon-mainnet.g.alchemy.com/v2/${apiKey}`)
   }
   return polygonRpcProvider;
}

export const getDefaultProviderByNetwork = (network: number, service: any) => {
   let apiKey;

   const foundAlchemyKey = Object.hasOwn(service, 'alchemy');
   const foundInfuraKey = Object.hasOwn(service, 'infura');
   const foundEtherscanKey = Object.hasOwn(service, 'etherscan');

   if (foundAlchemyKey) {
      apiKey = service.alchemy;
   } else if (foundInfuraKey) {
      apiKey = service.infura;
   } else if (foundEtherscanKey) {
      apiKey = service.etherscan;
   }

   let defaultProvider;
   if (network == 137) {                                                               // Polygon
      defaultProvider = ethers.getDefaultProvider(getPolygonRpcProvider(network, apiKey));
    } else if (network == 80001) {                                                      // Mumbai
      defaultProvider = ethers.getDefaultProvider(getMumbaiRpcProvider(network, apiKey));
    } else {                                                                            // Mainnet / Kovan
      defaultProvider = ethers.getDefaultProvider(network, service);
    }
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