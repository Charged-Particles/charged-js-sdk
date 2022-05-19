import ChargedParticles from "./abis/v2/ChargedParticles.json";
import mainnetAddresses from './networks/v2/mainnet.json';
import { ethers } from 'ethers';

// @notice returns the state adress from the ChargedParticles contract
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

// @notice returns the settings adress from the ChargedParticles contract
// @param provider - optional parameter. if not defined the code will use the ethers default provider.
// @returns string of settings address
export const getSettingsAddress = async (provider?:ethers.providers.JsonRpcProvider) => {
   const defaultProvider:ethers.providers.BaseProvider = ethers.providers.getDefaultProvider();
   const contract:ethers.Contract = new ethers.Contract(
      mainnetAddresses.chargedParticles.address,
      ChargedParticles,
      provider ?? defaultProvider
   );
   const settingsAddress:String = await contract.getSettingsAddress();
   return settingsAddress;
}

// @notice returns the managers adress from the ChargedParticles contract
// @param provider - optional parameter. if not defined the code will use the ethers default provider.
// @returns string of settings address
export const getManagersAddress = async (provider?:ethers.providers.JsonRpcProvider) => {
   const defaultProvider:ethers.providers.BaseProvider = ethers.providers.getDefaultProvider();
   const contract:ethers.Contract = new ethers.Contract(
      mainnetAddresses.chargedParticles.address,
      ChargedParticles,
      provider ?? defaultProvider
   );
   const managersAddress:String = await contract.getManagersAddress();
   return managersAddress;
}

// @notice Calculates the amount of Fees to be paid for a specific deposit amount
// @param provider - optional parameter. if not defined the code will use the ethers default provider.
// @param assetAmount - a wei string of amount of assets to calculate fees on
// @returns the amount of protocol fees for the protocol as a decimal string
export const getFeesForDeposit = async (assetAmount:String,  provider?:ethers.providers.JsonRpcProvider) => {
   const defaultProvider:ethers.providers.BaseProvider = ethers.providers.getDefaultProvider();
   const contract:ethers.Contract = new ethers.Contract(
      mainnetAddresses.chargedParticles.address,
      ChargedParticles,
      provider ?? defaultProvider
   );
   const protocolFee:String = await contract.getFeesForDeposit(assetAmount);
   return protocolFee.toString();
}