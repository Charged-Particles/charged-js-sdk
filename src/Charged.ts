import { ethers, providers } from "ethers";
import ChargedParticles from "./abis/v2/ChargedParticles.json";
import { getStateAddress } from "./ChargedParticles";

export default class Charged  {
  RPC_URL: String;
  provider: providers.Provider;

  constructor(_RPC_URL: String, _provider: providers.Provider) {
    this.RPC_URL = _RPC_URL;
    this.provider = _provider;
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