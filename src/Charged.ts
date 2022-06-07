import { ethers, providers, Signer } from "ethers";
import { SUPPORTED_NETWORKS } from "./utils/getAddressFromNetwork";

import UtilsService from "./services/UtilsService";
import NftService from "./services/NftService";

// Types
import { networkProvider, Configuration } from "./types";

type constructorCharged = {
  providers?: networkProvider[],
  externalProvider?: providers.Provider | providers.ExternalProvider,
  signer?: Signer,
};

export default class Charged  {
  public providers: {[network: number ]: providers.Provider} = {};

  public externalProvider?: providers.Provider; // GET RID OF THIS

  public web3Provider?: providers.ExternalProvider; // GET RID OF THIS

  public utils: any;

  readonly configuration: Configuration;

  constructor(params: constructorCharged = {}) {

    const { providers, externalProvider, signer } = params;

    if (providers) {
      providers?.forEach(({network, service }) => {
        if (!_.includes(_.map(SUPPORTED_NETWORKS, 'chainId'), network)) {
          throw new Error('...');
        }
        this.providers[network] = ethers.getDefaultProvider(network, service);
      });
    } else {
      SUPPORTED_NETWORKS.forEach(({chainId}) => {
        const network = ethers.providers.getNetwork(chainId);

        if (Boolean(network._defaultProvider)) {
          this.providers[chainId] = ethers.getDefaultProvider(network);
        }
      });

      console.log(
        `Charged Particles: These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
        It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
      );
    }

    if (signer) {
      this.signer = signer;
      if (!(signer instanceof ethers.providers.Provider)) {
        this.signer = new ethers.providers.Web3Provider(signer);
      }
    }

    this.configuration = {
      signer,
      providers: this.providers,
      externalProvider: this.externalProvider,
      web3Provider: this.web3Provider
    };

    this.utils = new UtilsService(this.configuration);
  }

  public NFT(contractAddress: string, tokenId: number) {
    return new NftService(this.configuration, contractAddress, tokenId);
  }
}