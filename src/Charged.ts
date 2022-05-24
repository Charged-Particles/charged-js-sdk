import { ethers, providers } from "ethers";
import { initContract } from "./ChargedParticles";

// Types 
import { Networkish } from "@ethersproject/networks";
import { DefaultProviderKeys } from "./types";

export default class Charged  {
  provider: providers.Provider;
  network: Networkish;
  chargedParticlesContract;
  chargedParticlesMethods;

  constructor(
   network: Networkish,
   defaultProviderKeys?: DefaultProviderKeys,
   injectedProvider?: providers.Provider
   ) {

    this.network = network;

    // If no provider is injected, instantate from PK.
    if (!injectedProvider) {
      if (Boolean(defaultProviderKeys)) {
        this.provider = ethers.getDefaultProvider(network, defaultProviderKeys);
      } else {
        this.provider = ethers.getDefaultProvider(network);
        console.log(
          `These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
          It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
        );
      }
    } else {
      this.provider = injectedProvider;
    }

    //Exposing all contract methos
    this.chargedParticlesContract = initContract(this.provider, this.network);
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