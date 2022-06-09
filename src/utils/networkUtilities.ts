export const getChainNameById = (network?: number) => {
  // if network is not given. default to mainnet
  if(!network) { return 'mainnet' };
  switch(network) {
    case 1: return 'mainnet';
    case 42: return 'kovan';
    case 137: return 'polygon';
    case 80001: return 'mumbai';
    default: throw 'bad/unsupported chain given to getAddressFromNetwork';
  }
}

export const SUPPORTED_NETWORKS = [
  {chainId:     1, chainName: 'eth', name: 'Ethereum'},
  {chainId:    42, chainName: 'kovan', name: 'Ethereum (Kovan)'},
  {chainId:   137, chainName: 'polygon', name: 'Polygon'},
  {chainId: 80001, chainName: 'mumbai',  name: 'Polygon (Mumbai)'},
];