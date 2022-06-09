import { ethers, providers, Signer } from "ethers";
import { SUPPORTED_NETWORKS } from "./utils/getAddressFromNetwork";

import UtilsService from "./services/UtilsService";
import NftService from "./services/NftService";

// Types 
import { networkProvider, Configuration } from "./types";

type constructorCharged = {
  providers?: networkProvider[] | providers.Provider | providers.ExternalProvider,
  signer?: Signer,
};

export default class Charged {
  
  public utils: any;
  
  readonly configuration: Configuration;
  
  constructor(params: constructorCharged = {}) {
    
    const { providers, signer } = params;

    let initializeProviders: { [network:string]: providers.Provider } = {};

    if (providers) {

      if (Array.isArray(providers)) {
        providers?.forEach(({ network, service }) => {
          initializeProviders[network] = ethers.getDefaultProvider(network, service);
        });
      } else if (providers instanceof ethers.providers.Provider) {
        initializeProviders['external'] = providers;
      } else {
        initializeProviders['external'] = new ethers.providers.Web3Provider(providers);
      }
    }
    else {
      SUPPORTED_NETWORKS.forEach(({ chainId }) => {
        const network = ethers.providers.getNetwork(chainId);
        if (Boolean(network._defaultProvider)) {
          initializeProviders[chainId] = ethers.getDefaultProvider(network);
        }
      });

      console.info(
        `Charged Particles: These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
        It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
      );
    }

    this.configuration = {
      signer,
      providers: initializeProviders,
    };

    this.utils = new UtilsService(this.configuration);
  }

  public NFT(contractAddress: string, tokenId: number) {
    return new NftService(this.configuration, contractAddress, tokenId);
  }
}