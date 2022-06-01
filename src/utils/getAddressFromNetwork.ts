import { Networkish } from '@ethersproject/networks';

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