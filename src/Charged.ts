import { ethers, providers, Signer, Wallet } from "ethers";
import UtilsService from "./services/UtilsService";
import { SUPPORTED_NETWORKS } from "./utils/config";

// Types 
import { constructorParams, Configuration } from "./types";

export default class Charged  {
  providers: {[network: number ]: providers.Provider} = {};

  signer?: Wallet | Signer;

  readonly configuration: Configuration;

  // @ts-ignore
  public utils;
  // public NFT;

  constructor(params: constructorParams = {}) {

    const {
      providers,
      signer, 
    } = params;
    
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
    // this.NFT = new NftService(this.configuration);

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