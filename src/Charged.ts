import { ethers, providers, Signer, Wallet } from "ethers";
import { initContract } from "./ChargedParticles";

// Types 
import { Networkish } from "@ethersproject/networks";
import { DefaultProviderKeys } from "./types";

export default class Charged  {
  network: Networkish | undefined;
  provider: providers.Provider | undefined;
  signer: Wallet | Signer  | undefined;
  chargedParticlesContract;
  chargedParticlesMethods;

  constructor(
   provider?: providers.Provider | string,
   signer?: Wallet | Signer | undefined,
   network?: Networkish,
   defaultProviderKeys?: DefaultProviderKeys,

   //provider
   //signer
   //defaultProvider {keys, network}
   ) {

    this.network = network;
    this.signer = signer;

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
    }  else if (typeof provider === 'string') {
      this.provider = new providers.StaticJsonRpcProvider(provider, network);
    } else if (provider instanceof providers.Provider) {
      this.provider = provider;
    } else {
      this.provider = new providers.Web3Provider(provider, network);
    }

    //Exposing all contract methos
    this.chargedParticlesContract = initContract(this.provider, this.network, this.signer);

    // Alternative, expose all methos
    this.chargedParticlesMethods = {...this.chargedParticlesContract.functions}
  }

  /// @notice returns the state adress from the ChargedParticles contract
  /// @param provider - optional parameter. if not defined the code will use the ethers default provider.
  /// @returns string of state address
  public async getStateAddress() {
    const stateAddress:String = await this.chargedParticlesContract.getStateAddress();
    return stateAddress;
  }

  // functions ... 
}


/*
  const charge = new Charge(...)

  charge.getStateAddress

  const chargedParticleContract = charged.getChargeParticleContract()
  chargedParticleContract.getStateAddress;

*/