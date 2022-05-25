import { ethers, providers, Wallet } from "ethers";
import { initContract } from "./ChargedParticles";

// Types 
import { Networkish } from "@ethersproject/networks";
import { DefaultProviderKeys } from "./types";

export default class Charged  {
  network: Networkish;
  provider: providers.Provider | string | undefined;
  wallet: Wallet | undefined;
  chargedParticlesContract;
  chargedParticlesMethods;

  constructor(
   network: Networkish,
   injectedProvider?: providers.Provider,
   wallet?: Wallet,
   defaultProviderKeys?: DefaultProviderKeys,

   //provider
   //signer
   //defaultProvider {keys, network}
   ) {

    this.network = network;
    this.wallet = wallet;

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
    } else {
      this.provider = new providers.Web3Provider(injectedProvider, network);
    }

    //Exposing all contract methos
    this.chargedParticlesContract = initContract(this.provider, this.network, this.wallet);

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