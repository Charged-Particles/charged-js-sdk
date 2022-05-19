import ChargedParticles from "./abis/v2/ChargedParticles.json";
import mainnetAddresses from './networks/v2/mainnet.json';
import { ethers } from 'ethers';

// @dev returns the state adress from the ChargedParticles contract
// @param provider - optional parameter. if not defined the code will use the ethers default provider.
// @returns string of state address
export const getStateAddress = async (provider?:ethers.providers.JsonRpcProvider) => {
   const defaultProvider:ethers.providers.BaseProvider = ethers.providers.getDefaultProvider();
   const contract:ethers.Contract = new ethers.Contract(
      mainnetAddresses.chargedParticles.address,
      ChargedParticles,
      provider ?? defaultProvider
   );
   const stateAddress:String = await contract.getStateAddress();
   return stateAddress;
}