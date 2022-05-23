import ChargedParticles from "./abis/v2/ChargedParticles.json";
import { ethers } from 'ethers';
import { Networkish } from "@ethersproject/networks";

import mainnetAddresses from './networks/v2/mainnet.json';
import kovanAddresses from './networks/v2/kovan.json';
import polygonAddresses from './networks/v2/polygon.json';
import mumbaiAddresses from './networks/v2/mumbai.json';


type MultiProvider = ethers.providers.JsonRpcProvider | 
   ethers.providers.BaseProvider |
   ethers.providers.AlchemyProvider | 
   ethers.providers.InfuraProvider | 
   ethers.providers.EtherscanProvider |
   ethers.providers.CloudflareProvider |
   ethers.providers.PocketProvider | 
   ethers.providers.AnkrProvider;

// Boilerplate. Returns the CP contract with the correct provider
const initContract = (provider?:MultiProvider, network?:Networkish) => {
   const networkFormatted:String = getAddressFromNetwork(network);
   const defaultProvider:ethers.providers.BaseProvider = ethers.providers.getDefaultProvider();
   
   // if a unsupported chain is given. default to mainnet
   let address:string;
   switch(networkFormatted) {
      case 'mainnet': address = mainnetAddresses.chargedParticles.address; break;
      case 'kovan': address = kovanAddresses.chargedParticles.address; break;
      case 'polygon': address = polygonAddresses.chargedParticles.address; break;
      case 'mumbai': address = mumbaiAddresses.chargedParticles.address; break;
      default: address = mainnetAddresses.chargedParticles.address; break;
   }

   return new ethers.Contract(
      address,
      ChargedParticles,
      provider ?? defaultProvider
   );
}

// Charged Particles is only deployed on Mainnet, Kovan, Polygon, and Mumbai
const getAddressFromNetwork = (network?:Networkish) => {
   // if network is not given. default to mainnet
   if(!network) { return 'mainnet' };

   if(typeof network === "string") {
      switch(network) {
         case 'homestead': return 'mainnet';
         case 'kovan': return 'kovan';
         case 'matic': return 'polygon';
         case 'polygon': return 'polygon';
         case 'maticmum': return 'mumbai';
         case 'mumbai': return 'mumbai';
         default: return 'unsupported chain';
      }
   } else if(typeof network === "number") {
      switch(network) {
         case 1: return 'mainnet';
         case 42: return 'kovan';
         case 137: return 'polygon';
         case 80001: return 'mumbai';
         default: return 'unsupported chain';
      }
   } else {
      // network is a Network type object here. See ethers doc for more info.
      switch(network.chainId) {
         case 1: return 'mainnet';
         case 42: return 'kovan';
         case 137: return 'polygon';
         case 80001: return 'mumbai';
         default: return 'unsupported chain';
      }
   }
}

/// @notice returns the state adress from the ChargedParticles contract
/// @param provider - optional parameter. if not defined the code will use the ethers default provider.
/// @returns string of state address
export const getStateAddress = async (provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   const stateAddress:String = await contract.getStateAddress();
   return stateAddress;
}

/// @notice returns the settings adress from the ChargedParticles contract
/// @param provider - optional parameter. if not defined the code will use the ethers default provider.
/// @returns string of settings address
export const getSettingsAddress = async (provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   const settingsAddress:String = await contract.getSettingsAddress();
   return settingsAddress;
}

/// @notice returns the managers adress from the ChargedParticles contract
/// @param provider - optional parameter. if not defined the code will use the ethers default provider.
/// @returns string of settings address
export const getManagersAddress = async (provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   const managersAddress:String = await contract.getManagersAddress();
   return managersAddress;
}

/// @notice Calculates the amount of Fees to be paid for a specific deposit amount
/// @param provider - optional parameter. if not defined the code will use the ethers default provider.
/// @param assetAmount - a wei string of amount of assets to calculate fees on
/// @returns the amount of protocol fees for the protocol as a decimal string
export const getFeesForDeposit = async (assetAmount:String,  provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
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
export const getBaseParticleMass = async (contractAddress:String, tokenId:String, walletManagerId:String, assetToken:String, provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
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
export const getCurrentParticleCharge = async (contractAddress:String, tokenId:String, walletManagerId:String, assetToken:String, provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
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
export const getParticleKinetics = async (contractAddress:String, tokenId:String, walletManagerId:String, assetToken:String, provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   const currentParticleKinetics = await contract.currentParticleKinetics(contractAddress, tokenId, walletManagerId, assetToken);
   return currentParticleKinetics.toString();
}

/// @notice Fund Particle with Asset Token
///    Must be called by the account providing the Asset
///    Account must Approve THIS contract as Operator of Asset
///
/// NOTE: DO NOT Energize an ERC20 Token, as anyone who holds any amount
///       of the same ERC20 token could discharge or release the funds.
///       All holders of the ERC20 token would essentially be owners of the Charged Particle.
///
/// @param contractAddress      The Address to the Contract of the Token to Energize
/// @param tokenId              The ID of the Token to Energize
/// @param walletManagerId  The Asset-Pair to Energize the Token with
/// @param assetToken           The Address of the Asset Token being used
/// @param assetAmount          The Amount of Asset Token to Energize the Token with
/// @return yieldTokensAmount The amount of Yield-bearing Tokens added to the escrow for the Token
export const energizeParticle = async (contractAddress:String, tokenId:String, walletManagerId:String, assetToken:String, assetAmount:Number, provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   return await contract.energizeParticle(contractAddress, tokenId, walletManagerId, assetToken, assetAmount);
}

/// @notice Allows the owner or operator of the Token to collect or transfer the interest generated
///         from the token without removing the underlying Asset that is held within the token.
/// @param receiver             The Address to Receive the Discharged Asset Tokens
/// @param contractAddress      The Address to the Contract of the Token to Discharge
/// @param tokenId              The ID of the Token to Discharge
/// @param walletManagerId      The Wallet Manager of the Assets to Discharge from the Token
/// @param assetToken           The Address of the Asset Token being discharged
/// @return creatorAmount Amount of Asset Token discharged to the Creator
/// @return receiverAmount Amount of Asset Token discharged to the Receiver
export const dischargeParticle = async (receiver:String, contractAddress:String, tokenId:String, walletManagerId:String, assetToken:String, provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   return await contract.dischargeParticle(receiver, contractAddress, tokenId, walletManagerId, assetToken);
}

/// @notice Allows the owner or operator of the Token to collect or transfer a specific amount of the interest
///         generated from the token without removing the underlying Asset that is held within the token.
/// @param receiver             The Address to Receive the Discharged Asset Tokens
/// @param contractAddress      The Address to the Contract of the Token to Discharge
/// @param tokenId              The ID of the Token to Discharge
/// @param walletManagerId  The Wallet Manager of the Assets to Discharge from the Token
/// @param assetToken           The Address of the Asset Token being discharged
/// @param assetAmount          The specific amount of Asset Token to Discharge from the Token
/// @return creatorAmount Amount of Asset Token discharged to the Creator
/// @return receiverAmount Amount of Asset Token discharged to the Receiver

export const dischargeParticleAmount = async (receiver:String, contractAddress:String, tokenId:String, walletManagerId:String, assetToken:String, assetAmount:Number, provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   return await contract.dischargeParticleAmount(receiver, contractAddress, tokenId, walletManagerId, assetToken, assetAmount);
}