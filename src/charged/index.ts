import { ethers, providers, Signer } from "ethers";
import { SUPPORTED_NETWORKS, getDefaultProviderByNetwork } from "../utils/networkUtilities";
import { NetworkProvider, ChargedState, ConfigurationParameters } from "../types";

import UtilsService from "./services/UtilsService";
import NftService from "./services/NftService";

/**
 * Charged class constructor object parameter.
 * @typedef {Object} ChargedConstructor
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

  readonly state: ChargedState;

  /**
  * Create a Charged instance.
  * @constructs ChargedConstructor
  * @param {ChargedConstructor} params - Charged parameter object.
  */
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
        It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
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

  /**
  * Returns a wrapped token with charged particle methods.
  * @param {string} contractAddress
  * @param {number} tokenId
  * @return {NftService}  Instance of the NFT connected to the charged particle protocol
  * 
  * @example
  * const charged = new Charged({providers: window.ethereum});
  * 
  * const nft = charged.NFT( '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963', 43);
  * 
  * const creatorAnnuities = await nft.getCreatorAnnuities();
  */
  public NFT(contractAddress: string, tokenId: number) {
    return new NftService(this.state, contractAddress, tokenId);
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