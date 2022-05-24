import ChargedState from "./abis/v2/ChargedState.json";
import { ethers, BigNumberish } from 'ethers';
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

// type MultiSigner = ethers.Signer |
//    ethers.VoidSigner |
//    ethers.Wallet |
//    ethers.providers.JsonRpcSigner;

// Boilerplate. Returns the CP contract with the correct provider
const initContract = (provider?:MultiProvider, network?:Networkish) => {
   const networkFormatted:String = getAddressFromNetwork(network);
   const defaultProvider:ethers.providers.BaseProvider = ethers.providers.getDefaultProvider();
   
   // if a unsupported chain is given. default to mainnet
   let address:string;
   switch(networkFormatted) {
      case 'mainnet': address = mainnetAddresses.chargedState.address; break;
      case 'kovan': address = kovanAddresses.chargedState.address; break;
      case 'polygon': address = polygonAddresses.chargedState.address; break;
      case 'mumbai': address = mumbaiAddresses.chargedState.address; break;
      default: address = mainnetAddresses.chargedState.address; break;
   }

   return new ethers.Contract(
      address,
      ChargedState,
      provider ?? defaultProvider
   );
}

// Create a contract with a signer attached. Signer is required as there is no default to use.
// const initSignerContract = (signer:ethers.Signer, network?:Networkish) => {
//    if(!signer) {
//       throw 'No signer passed. Cannot continue.';
//    }
//    const networkFormatted:String = getAddressFromNetwork(network);

//       // if a unsupported chain is given. default to mainnet
//    let address:string;
//    switch(networkFormatted) {
//       case 'mainnet': address = mainnetAddresses.chargedState.address; break;
//       case 'kovan': address = kovanAddresses.chargedState.address; break;
//       case 'polygon': address = polygonAddresses.chargedState.address; break;
//       case 'mumbai': address = mumbaiAddresses.chargedState.address; break;
//       default: address = mainnetAddresses.chargedState.address; break;
//    }

//    return new ethers.Contract(
//       address,
//       ChargedState,
//       signer
//    );
// }

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// READ FUNCTIONS ** Signer not required / Gasless
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/// @notice
/// @param     contractAddress - specify which contract
/// @param     tokenId - specify tokenId of said contract
/// @returns   the discharge timelock expiry date as a big number
export const getDischargeTimelockExpiry = async (contractAddress:String, tokenId:BigNumberish, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract(provider, network);
  const timelockExpiry = await contract.getDischargeTimelockExpiry(contractAddress, tokenId);
  return timelockExpiry;
}

/// @notice
/// @param     contractAddress - specify which contract
/// @param     tokenId - specify tokenId of said contract
/// @returns   the releasetimelock expiry date as a big number
export const getReleaseTimelockExpiry = async (contractAddress:String, tokenId:BigNumberish, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract(provider, network);
  const timelockExpiry = await contract.getReleaseTimelockExpiry(contractAddress, tokenId);
  return timelockExpiry;
}

/// @notice
/// @param     contractAddress - specify which contract
/// @param     tokenId - specify tokenId of said contract
/// @returns   the break bond timelock expiry date as a big number
export const getBreakBondTimelockExpiry = async (contractAddress:String, tokenId:BigNumberish, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract(provider, network);
  const timelockExpiry = await contract.getBreakBondTimelockExpiry(contractAddress, tokenId);
  return timelockExpiry;
}

/// @notice Checks if an operator is allowed to Discharge a specific Token
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the operator to check
/// @return True if the operator is Approved
export const isApprovedForDischarge = async (contractAddress:String, tokenId:BigNumberish, operator:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract(provider, network);
  const isApproved = await contract.staticCall.isApprovedForDischarge(contractAddress, tokenId, operator);
  return isApproved;
}

/// @notice Checks if an operator is allowed to Release a specific Token
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the operator to check
/// @return True if the operator is Approved
export const isApprovedForRelease = async (contractAddress:String, tokenId:BigNumberish, operator:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract(provider, network);
  const isApproved = await contract.staticCall.isApprovedForRelease(contractAddress, tokenId, operator);
  return isApproved;
}

/// @notice Checks if an operator is allowed to Break Covalent Bonds on a specific Token
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the operator to check
/// @return True if the operator is Approved
export const isApprovedForBreakBond = async (contractAddress:String, tokenId:BigNumberish, operator:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract(provider, network);
  const isApproved = await contract.staticCall.isApprovedForBreakBond(contractAddress, tokenId, operator);
  return isApproved;
}

/// @notice Checks if an operator is allowed to Timelock a specific Token
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the operator to check
/// @return True if the operator is Approved
export const isApprovedForTimeLock = async (contractAddress:String, tokenId:BigNumberish, operator:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract(provider, network);
  const isApproved = await contract.staticCall.isApprovedForTimelock(contractAddress, tokenId, operator);
  return isApproved;
}

/// @notice Checks if a token is restricted from energizing
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @return True if energize is restricted
export const isEnergizeRestricted = async (contractAddress:String, tokenId:BigNumberish, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract(provider, network);
  const isRestricted = await contract.isEnergizeRestricted(contractAddress, tokenId);
  return isRestricted;
}

/// @notice Checks if a token is restricted from covalent bonding
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @return True if bonding is restricted
export const isCovalentBondRestricted = async (contractAddress:String, tokenId:BigNumberish, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract(provider, network);
  const isRestricted = await contract.staticCall.isCovalentBondRestricted(contractAddress, tokenId);
  return isRestricted;
}

// TODO: document returns + notice correctly
/// @notice 
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @returns allowFromAll - boolean
/// @returns isApproved - boolean
/// @returns timelock - bignumber
/// @returns tempLockExpiry - bignumber
export const getDischargeState = async (contractAddress:String, tokenId:BigNumberish, sender:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract(provider, network);
  const result = await contract.staticCall.getDischargeState(contractAddress, tokenId, sender);
  return result;
}

// TODO: document returns + notice correctly
/// @notice 
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @returns allowFromAll - boolean
/// @returns isApproved - boolean
/// @returns timelock - bignumber
/// @returns tempLockExpiry - bignumber
export const getReleaseState = async (contractAddress:String, tokenId:BigNumberish, sender:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract(provider, network);
  const result = await contract.staticCall.getReleaseState(contractAddress, tokenId, sender);
  return result;
}

// TODO: document returns + notice correctly
/// @notice 
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @returns allowFromAll - boolean
/// @returns isApproved - boolean
/// @returns timelock - bignumber
/// @returns tempLockExpiry - bignumber
export const getBreakBondState = async (contractAddress:String, tokenId:BigNumberish, sender:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract(provider, network);
  const result = await contract.staticCall.getBreakBondState(contractAddress, tokenId, sender);
  return result;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// WRITE FUNCTIONS ** Signer required
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


/***********************************|
|      Only NFT Owner/Operator      |
|__________________________________*/