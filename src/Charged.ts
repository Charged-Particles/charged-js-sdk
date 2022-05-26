import { ethers, providers, Signer, Wallet } from "ethers";
import ChargedParticlesService from "./services/ChargedParticleService";

// Types 
import { Networkish } from "@ethersproject/networks";
import { constructorParams, Configuration } from "./types";

export default class Charged  {
  network: Networkish | undefined;

  provider?: providers.Provider;

  signer?: Wallet | Signer;

  chargedParticlesContract; // TODO: set interfase as type

  readonly configuration: Configuration;

  constructor(params: constructorParams = {}) {

    const {
      network = 1,
      provider,
      signer, 
      defaultProviderKeys
    } = params;
    
    this.signer = signer;
    this.network = network;

    if (!provider) {
      if (Boolean(defaultProviderKeys)) {
        this.provider = ethers.getDefaultProvider(network, defaultProviderKeys);
      } else {
        this.provider = ethers.getDefaultProvider(network);
        console.log(
          `Charged particles: These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
          It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
        );
      }
    } else if (typeof provider === 'string') {
      this.provider = new providers.StaticJsonRpcProvider(provider, network);
    } else if (provider instanceof providers.Provider) {
      this.provider = provider;
    } else if (provider instanceof providers.Web3Provider){
      this.provider = new providers.Web3Provider(provider, network);
    } else {
      //TODO: error msg
    }

    this.configuration = {network, signer, provider: this.provider};
    this.chargedParticlesContract = new ChargedParticlesService(this.configuration);
  }
}