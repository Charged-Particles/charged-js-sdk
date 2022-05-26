import { ethers, providers, Signer, Wallet } from "ethers";
import ChargedParticlesService from "./services/ChargedParticleService";

// Types 
import { Networkish } from "@ethersproject/networks";
import { DefaultProviderKeys, Configuration } from "./types";

export default class Charged  {
  network: Networkish | undefined;

  provider: providers.Provider | undefined;

  signer: Wallet | Signer  | undefined;

  chargedParticlesContract; // set interfase as type

  readonly configuration: Configuration;

  constructor(
   network: Networkish,
   injectedProvider?: providers.Provider | providers.ExternalProvider | string,
   signer?: Signer | undefined, // TODO: default valu
   defaultProviderKeys?: DefaultProviderKeys,

   //provider
   //signer
   //defaultProvider {keys, network}
   ) {
    this.network = network;
    this.signer = signer;

    if (!injectedProvider) {
      if (Boolean(defaultProviderKeys)) {
        this.provider = ethers.getDefaultProvider(network, defaultProviderKeys);
      } else {
        this.provider = ethers.getDefaultProvider(network);
        console.log(
          `Charged particles: These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
          It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
        );
      }
    }  else if (typeof injectedProvider === 'string') {
      this.provider = new providers.StaticJsonRpcProvider(injectedProvider, network);
    } else if (injectedProvider instanceof providers.Provider) {
      this.provider = injectedProvider;
    } else if (injectedProvider instanceof providers.Web3Provider){
      this.provider = new providers.Web3Provider(injectedProvider, network);
    } else {
      //TODO: error msg
    }

    this.configuration = {network: this.network, provider: this.provider, signer:this.signer}

    this.chargedParticlesContract = new ChargedParticlesService(this.configuration);

    console.log(this.chargedParticlesContract.getStateAddress());
  }
}