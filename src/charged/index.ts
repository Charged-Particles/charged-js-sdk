import { ethers, providers, Signer } from "ethers";
import { SUPPORTED_NETWORKS, getDefaultProviderByNetwork } from "../utils/networkUtilities";
import { NetworkProvider, ChargedState, ConfigurationParameters } from "../types";

import UtilsService from "./services/UtilsService";
import NftService from "./services/NftService";

/**
 * Charged class constructor object parameter.
 * @typedef {Object} ChargedConstructor
 * @memberof Charged
 * @property {NetworkProvider[] | providers.Provider | providers.ExternalProvider} [providers=defaultProvider] -  Provider for connection to the Ethereum network.
 * @property {Signer} [signer] - Needed to send signed transactions to the Ethereum Network to execute state changing operations.
 * @property {ConfigurationParameters} config
 */
type ChargedConstructor = {
  providers?: NetworkProvider[] | providers.Provider | providers.ExternalProvider,
  signer?: Signer,
  config?: ConfigurationParameters
};

/**
 * @module Charged
 * @class Charged
 * Create a Charged instance.
 * @constructs ChargedConstructor
 * @param {ChargedConstructor} params - Charged constructor object.
 * @example
 * const charged = new Charged({providers: window.ethereum});
 * const allStateAddresses = await charged.utils.getStateAddress();
 *
 * const polygonProvider = [
 *  {
 *    network: 137,
 *    service: {alchemy: process.env.ALCHEMY_POLYGON_KEY}
 *  }
 * ];
 * const charged = new Charged({providers: polygonProvider})
 *
*/

export default class Charged {

  public utils: UtilsService;

  private state: ChargedState;

  constructor(params: ChargedConstructor = {}) {

    const { providers, signer, config: userConfig } = this.getValidatedParams(params);

    let initializedProviders: { [network: string]: providers.Provider } = {};

    if (providers) {
      if (Array.isArray(providers)) {
        providers?.forEach(({ network, service }) => {
          initializedProviders[network] = getDefaultProviderByNetwork(network, service);
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
        It is highly recommended to use your own keys: https://docs.ethers.io/v5/api-keys/`
      );
    }

    const defaultConfig: ConfigurationParameters = {
      sdk: { NftBridgeCheck: false },
      transactionOverride: {},
    }

    this.state = {
      signer,
      providers: initializedProviders,
      configuration: { ...defaultConfig, ...userConfig }
    };

    this.utils = new UtilsService(this.state);
  }

  public NFT(contractAddress: string, tokenId: number) {
    return new NftService(this.state, contractAddress, tokenId);
  }

  public getState() {
    return this.state;
  }

  public setSigner(signer: Signer) {
    this.state = { ...this.state, signer };
  }

  public setExternalProvider(provider: ethers.providers.Provider) {
    this.state.providers['external'] = provider;
  }

  private getValidatedParams(params: ChargedConstructor) {
    const validParameters = ['providers', 'signer', 'config'];

    for (const param in params) {
      if (!validParameters.includes(param)) {
        throw Error(`${param} is not a valid parameter`);
      }
    }
    return params;
  }
}