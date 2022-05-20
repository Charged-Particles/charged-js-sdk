import ChargedParticles from "./abis/v2/ChargedParticles.json";
import mainnetAddresses from './networks/v2/mainnet.json';
import { ethers } from 'ethers';

// Boilerplate. Returns the CP contract with the correct provider
const initContract = (provider?:ethers.providers.JsonRpcProvider) => {
   const defaultProvider:ethers.providers.BaseProvider = ethers.providers.getDefaultProvider();
   return new ethers.Contract(
      mainnetAddresses.chargedParticles.address,
      ChargedParticles,
      provider ?? defaultProvider
   );
}

/// @notice returns the state adress from the ChargedParticles contract
/// @param provider - optional parameter. if not defined the code will use the ethers default provider.
/// @returns string of state address
export const getStateAddress = async (provider?:ethers.providers.JsonRpcProvider) => {
   const contract:ethers.Contract = initContract(provider);
   const stateAddress:String = await contract.getStateAddress();
   return stateAddress;
}

/// @notice returns the settings adress from the ChargedParticles contract
/// @param provider - optional parameter. if not defined the code will use the ethers default provider.
/// @returns string of settings address
export const getSettingsAddress = async (provider?:ethers.providers.JsonRpcProvider) => {
   const contract:ethers.Contract = initContract(provider);
   const settingsAddress:String = await contract.getSettingsAddress();
   return settingsAddress;
}

/// @notice returns the managers adress from the ChargedParticles contract
/// @param provider - optional parameter. if not defined the code will use the ethers default provider.
/// @returns string of settings address
export const getManagersAddress = async (provider?:ethers.providers.JsonRpcProvider) => {
   const contract:ethers.Contract = initContract(provider);
   const managersAddress:String = await contract.getManagersAddress();
   return managersAddress;
}

/// @notice Calculates the amount of Fees to be paid for a specific deposit amount
/// @param provider - optional parameter. if not defined the code will use the ethers default provider.
/// @param assetAmount - a wei string of amount of assets to calculate fees on
/// @returns the amount of protocol fees for the protocol as a decimal string
export const getFeesForDeposit = async (assetAmount:String,  provider?:ethers.providers.JsonRpcProvider) => {
   const contract:ethers.Contract = initContract(provider);
   const protocolFee = await contract.getFeesForDeposit(assetAmount);
   return protocolFee.toString();
}

/// @notice Gets the Amount of Asset Tokens that have been Deposited into the Particle
/// representing the Mass of the Particle.
/// @param contractAddress      The Address to the Contract of the Token
/// @param tokenId              The ID of the Token
/// @param walletManagerId  The Liquidity-Provider ID to check the Asset balance of
/// @param assetToken           The Address of the Asset Token to check
/// @return The Amount of underlying Assets held within the Token as a decimal string
export const getBaseParticleMass = async (contractAddress:String, tokenId:String, walletManagerId:String, assetToken:String,  provider?:ethers.providers.JsonRpcProvider) => {
   const contract:ethers.Contract = initContract(provider);
   const particleMass = await contract.baseParticleMass(contractAddress, tokenId, walletManagerId, assetToken);
   console.log(typeof particleMass);
   return particleMass.toString();
}

/// @notice Gets the amount of Interest that the Particle has generated representing
/// the Charge of the Particle
/// @param contractAddress      The Address to the Contract of the Token
/// @param tokenId              The ID of the Token
/// @param walletManagerId  The Liquidity-Provider ID to check the Interest balance of
/// @param assetToken           The Address of the Asset Token to check
/// @return The amount of interest the Token has generated (in Asset Token) as a decimal string
export const getCurrentParticleCharge = async (contractAddress:String, tokenId:String, walletManagerId:String, assetToken:String,  provider?:ethers.providers.JsonRpcProvider) => {
   const contract:ethers.Contract = initContract(provider);
   const currentParticleCharge = await contract.currentParticleCharge(contractAddress, tokenId, walletManagerId, assetToken);
   return currentParticleCharge.toString();
}

/// @notice Gets the amount of LP Tokens that the Particle has generated representing
/// the Kinetics of the Particle
/// @param contractAddress      The Address to the Contract of the Token
/// @param tokenId              The ID of the Token
/// @param walletManagerId  The Liquidity-Provider ID to check the Kinetics balance of
/// @param assetToken           The Address of the Asset Token to check
/// @return The amount of LP tokens that have been generated as a decimal string
export const getParticleKinetics = async (contractAddress:String, tokenId:String, walletManagerId:String, assetToken:String,  provider?:ethers.providers.JsonRpcProvider) => {
   const contract:ethers.Contract = initContract(provider);
   const currentParticleKinetics = await contract.currentParticleKinetics(contractAddress, tokenId, walletManagerId, assetToken);
   return currentParticleKinetics.toString();
}