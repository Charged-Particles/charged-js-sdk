import { ethers, providers, Signer } from "ethers";
import { SUPPORTED_NETWORKS } from "./utils/getAddressFromNetwork";
import { NetworkProvider, ChargedState } from "./types";

import UtilsService from "./services/UtilsService";
import NftService from "./services/NftService";

type ChargedConstructor = {
  providers?: NetworkProvider[] | providers.Provider | providers.ExternalProvider,
  signer?: Signer,
};

export default class Charged {

  public utils: UtilsService;

  readonly state: ChargedState;

  constructor(params: ChargedConstructor = {}) {

    const { providers, signer } = params;

    let initializedProviders: { [network: string]: providers.Provider } = {};

    if (providers) {

      if (Array.isArray(providers)) {
        providers?.forEach(({ network, service }) => {
          initializedProviders[network] = ethers.getDefaultProvider(network, service);
        });
      } else if (providers instanceof ethers.providers.Provider) {
        initializedProviders['external'] = providers;
      } else {
        initializedProviders['external'] = new ethers.providers.Web3Provider(providers);
      }
    }
    else {
      SUPPORTED_NETWORKS.forEach(({ chainId }) => {
        const network = ethers.providers.getNetwork(chainId);
        if (Boolean(network._defaultProvider)) {
          initializedProviders[chainId] = ethers.getDefaultProvider(network);
        }
      });

      console.info(
        `Charged Particles: These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
        It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
      );
    }

    this.state = {
      signer,
      providers: initializedProviders,
    };

    this.utils = new UtilsService(this.state);
  }

  public NFT(contractAddress: string, tokenId: number) {
    return new NftService(this.state, contractAddress, tokenId);
  }
}