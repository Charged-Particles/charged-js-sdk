import { ethers, providers, Signer } from "ethers";
import { SUPPORTED_NETWORKS } from "./utils/config";

import UtilsService from "./services/UtilsService";
import NftService from "./services/NftService";

// Types 
import { networkProvider, Configuration } from "./types";

export default class Charged  {
  providers: {[network: number ]: providers.Provider} = {};

  signer?: Signer;

  readonly configuration: Configuration;

  public utils;

  constructor(providers?: networkProvider[], signer?: Signer) {

    this.signer = signer;

    if (Boolean(providers)) {
      providers?.forEach(({network, service }) => {
        this.providers[network] = ethers.getDefaultProvider(network, service); 
      })
    } else {
      SUPPORTED_NETWORKS.forEach(({chainId}) => {
        this.providers[chainId] = ethers.getDefaultProvider(chainId);
      })

      console.log(
        `Charged particles: These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
        It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
      );
    }

    this.configuration = { signer, providers: this.providers };

    this.utils = new UtilsService(this.configuration);
  }
  
  public NFT(
    particleAddress: string,
    tokenId: number,
    network: number // TODO: deduce network from passed particle address
  ) {
    return new NftService(this.configuration, particleAddress, tokenId, network);
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