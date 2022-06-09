import { ethers, providers, Signer } from "ethers";

import {
  SUPPORTED_NETWORKS,
  getPolygonRpcProvider,
  getMumbaiRpcProvider
} from "./utils/utilities";

import UtilsService from "./services/UtilsService";
import NftService from "./services/NftService";

// Types 
import { networkProvider, Configuration } from "./types";

type constructorCharged = {
  providers?: networkProvider[] | providers.Provider | providers.ExternalProvider,
  signer?: Signer,
};

export default class Charged {
  public providers: { [network:string]: providers.Provider } = {};

  public utils: any;

  readonly configuration: Configuration;

  constructor(params: constructorCharged = {}) {

    const { providers, signer } = params;

    if (providers) {
      if (Array.isArray(providers)) {
        providers?.forEach(({ network, service }) => {
          if (network == 137) {                                                               // Polygon
            this.providers[network] = ethers.getDefaultProvider(getPolygonRpcProvider(network, service.alchemy));
          } else if (network == 80001) {                                                      // Mumbai
            this.providers[network] = ethers.getDefaultProvider(getMumbaiRpcProvider(network, service.alchemy));
          } else {                                                                            // Mainnet / Kovan
            this.providers[network] = ethers.getDefaultProvider(network, service);
          }
        });
      } else if (providers instanceof ethers.providers.Provider) {
        this.providers['external'] = providers;
      } else {
        this.providers['external'] = new ethers.providers.Web3Provider(providers);
      }
    } else {
      SUPPORTED_NETWORKS.forEach(({ chainId }) => {
        const network = ethers.providers.getNetwork(chainId);
        if (Boolean(network._defaultProvider)) {
          this.providers[chainId] = ethers.getDefaultProvider(network);
        }
      });

      console.info(
        `Charged Particles: These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
        It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
      );
    }

    this.configuration = {
      signer,
      providers: this.providers,
    };

    this.utils = new UtilsService(this.configuration);
  }

  public NFT(contractAddress: string, tokenId: number) {
    return new NftService(this.configuration, contractAddress, tokenId);
  }
}