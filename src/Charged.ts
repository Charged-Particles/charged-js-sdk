import { ethers, providers, Signer } from "ethers";
import { SUPPORTED_NETWORKS } from "./utils/getAddressFromNetwork";

import UtilsService from "./services/UtilsService";
import NftService from "./services/NftService";

// Types 
import { networkProvider, Configuration } from "./types";

type constructorCharged = {
  providers?: networkProvider[],  
  injectedProvider?: providers.Provider | providers.ExternalProvider,
  signer?: Signer,
};

export default class Charged  {
  public providers: {[network: number ]: providers.Provider} = {};

  public injectedProvider?: providers.Provider;

  public utils: any;

  readonly configuration: Configuration;

  constructor(params: constructorCharged = {}) {

    const { providers, injectedProvider, signer } = params;

    if (providers) {
      providers?.forEach(({network, service }) => {
        ethers.providers.getNetwork(network);
        this.providers[network] = ethers.getDefaultProvider(network, service); 
      });
    } else if (injectedProvider) {

      if (injectedProvider instanceof ethers.providers.Provider) {
        this.injectedProvider = injectedProvider;
      } else {
        this.injectedProvider = new ethers.providers.Web3Provider(injectedProvider);
      }
      
    } else {
      SUPPORTED_NETWORKS.forEach(({chainId}) => {
        const network = ethers.providers.getNetwork(chainId);
        
        if (Boolean(network._defaultProvider)) {
          this.providers[chainId] = ethers.getDefaultProvider(network);
        }
      })

      console.log(
        `Charged Particles: These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
        It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
      );
    }

    this.configuration = { 
      signer,
      providers: this.providers, 
      injectedProvider: this.injectedProvider 
    };

    this.utils = new UtilsService(this.configuration);
  }
  
  public NFT(
    contractAddress: string,
    tokenId: number,
    network: number // TODO: deduce network from passed particle address
  ) {
    return new NftService(this.configuration, contractAddress, tokenId, network);
  }

}

/*

Provider
[
  {
    network: 1,
    service: 'alchmey' | 'infura',
    apiKey: 'secret'
  },
  { 
    network:42,
    service: 'alchemy'
    apikey: 'rm-l6Zef1007gyxMQIwPI8rEhaHM8N6a'
  }
]

// RPC 
[
  chainId => url,
  1 => https://eth-mainnet.alchemyapi.io/v2/qw02QqWNMg2kby3q3N39PxUT3KaRS5UE
]

*/