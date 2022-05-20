import { ethers, providers } from "ethers";
import { Networkish } from "@ethersproject/networks";
import ChargedParticles from "./abis/v2/ChargedParticles.json";
import { getStateAddress } from "./ChargedParticles";

export default class Charged  {
  RPC_URL: String;
  provider: providers.Provider;
  network: Networkish;

  constructor(
   _RPC_URL: String,
   _provider: providers.Provider,
   _network: Networkish
   ) {

    this.RPC_URL = _RPC_URL;
    this.provider = _provider;
    this.network = _network;

    if (!_provider) {
      if (Boolean(process.env.PK)) {
        this.provider = ethers.getDefaultProvider(_network, process.env.PK);
      } else {
        this.provider = ethers.getDefaultProvider(_network);
        console.log(
          `These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
          It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
        );
      }
    } else {
      this.provider = _provider;
    }
  }

  getStateAddress = getStateAddress;
  
  getChargeParticleContract() {
    const contract = new ethers.Contract(
      '0xaB1a1410EA40930755C1330Cc0fB3367897C8c41',
      ChargedParticles,
      this.provider
    );    

   return contract
  }
}


/*
  const charge = new Charge(...)

  charge.getStateAddress

  const chargedParticleContract = charged.getChargeParticleContract()
  chargedParticleContract.getStateAddress;

*/