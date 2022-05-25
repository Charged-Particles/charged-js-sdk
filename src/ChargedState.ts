
// External Frameworks
import { ethers, BigNumberish } from 'ethers';
import { Networkish } from "@ethersproject/networks";

// Helpers
import { initContract } from './utils/initContract';

// Types
import { MultiProvider, MultiSigner } from "./types";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// READ FUNCTIONS ** Signer not required / Gasless
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/// @notice
/// @param     contractAddress - specify which contract
/// @param     tokenId - specify tokenId of said contract
/// @returns   the discharge timelock expiry date as a big number
export const getDischargeTimelockExpiry = async (contractAddress:String, tokenId:BigNumberish, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', provider, network);
  const timelockExpiry = await contract.getDischargeTimelockExpiry(contractAddress, tokenId);
  return timelockExpiry;
}

/// @notice
/// @param     contractAddress - specify which contract
/// @param     tokenId - specify tokenId of said contract
/// @returns   the releasetimelock expiry date as a big number
export const getReleaseTimelockExpiry = async (contractAddress:String, tokenId:BigNumberish, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', provider, network);
  const timelockExpiry = await contract.getReleaseTimelockExpiry(contractAddress, tokenId);
  return timelockExpiry;
}

/// @notice
/// @param     contractAddress - specify which contract
/// @param     tokenId - specify tokenId of said contract
/// @returns   the break bond timelock expiry date as a big number
export const getBreakBondTimelockExpiry = async (contractAddress:String, tokenId:BigNumberish, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', provider, network);
  const timelockExpiry = await contract.getBreakBondTimelockExpiry(contractAddress, tokenId);
  return timelockExpiry;
}

/// @notice Checks if an operator is allowed to Discharge a specific Token
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the operator to check
/// @return True if the operator is Approved
export const isApprovedForDischarge = async (contractAddress:String, tokenId:BigNumberish, operator:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', provider, network);
  const isApproved = await contract.staticCall.isApprovedForDischarge(contractAddress, tokenId, operator);
  return isApproved;
}

/// @notice Checks if an operator is allowed to Release a specific Token
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the operator to check
/// @return True if the operator is Approved
export const isApprovedForRelease = async (contractAddress:String, tokenId:BigNumberish, operator:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', provider, network);
  const isApproved = await contract.staticCall.isApprovedForRelease(contractAddress, tokenId, operator);
  return isApproved;
}

/// @notice Checks if an operator is allowed to Break Covalent Bonds on a specific Token
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the operator to check
/// @return True if the operator is Approved
export const isApprovedForBreakBond = async (contractAddress:String, tokenId:BigNumberish, operator:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', provider, network);
  const isApproved = await contract.staticCall.isApprovedForBreakBond(contractAddress, tokenId, operator);
  return isApproved;
}

/// @notice Checks if an operator is allowed to Timelock a specific Token
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the operator to check
/// @return True if the operator is Approved
export const isApprovedForTimeLock = async (contractAddress:String, tokenId:BigNumberish, operator:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', provider, network);
  const isApproved = await contract.staticCall.isApprovedForTimelock(contractAddress, tokenId, operator);
  return isApproved;
}

/// @notice Checks if a token is restricted from energizing
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @return True if energize is restricted
export const isEnergizeRestricted = async (contractAddress:String, tokenId:BigNumberish, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', provider, network);
  const isRestricted = await contract.isEnergizeRestricted(contractAddress, tokenId);
  return isRestricted;
}

/// @notice Checks if a token is restricted from covalent bonding
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @return True if bonding is restricted
export const isCovalentBondRestricted = async (contractAddress:String, tokenId:BigNumberish, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', provider, network);
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
  const contract:ethers.Contract = initContract('chargedState', provider, network);
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
  const contract:ethers.Contract = initContract('chargedState', provider, network);
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
  const contract:ethers.Contract = initContract('chargedState', provider, network);
  const result = await contract.staticCall.getBreakBondState(contractAddress, tokenId, sender);
  return result;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// WRITE FUNCTIONS ** Signer required
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


/***********************************|
|      Only NFT Owner/Operator      |
|__________________________________*/

/// @notice Sets an Operator as Approved to Discharge a specific Token
/// This allows an operator to withdraw the interest-portion only
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the Operator to Approve
export const setDischargeApproval = async (contractAddress:String, tokenId:BigNumberish, operator:String, signer:MultiSigner, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', signer, network);
  const result = await contract.setDischargeApproval(contractAddress, tokenId, operator);
  return result;
}

/// @notice Sets an Operator as Approved to Release a specific Token
/// This allows an operator to withdraw the principal + interest
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the Operator to Approve
export const setReleaseApproval = async (contractAddress:String, tokenId:BigNumberish, operator:String, signer:MultiSigner, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', signer, network);
  const result = await contract.setReleaseApproval(contractAddress, tokenId, operator);
  return result;
}

/// @notice Sets an Operator as Approved to Break Covalent Bonds on a specific Token
/// This allows an operator to withdraw Basket NFTs
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the Operator to Approve
export const setBreakBondApproval = async (contractAddress:String, tokenId:BigNumberish, operator:String, signer:MultiSigner, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', signer, network);
  const result = await contract.setBreakBondApproval(contractAddress, tokenId, operator);
  return result;
}

/// @notice Sets an Operator as Approved to Timelock a specific Token
/// This allows an operator to timelock the principal or interest
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the Operator to Appr
export const setTimelockApproval = async (contractAddress:String, tokenId:BigNumberish, operator:String, signer:MultiSigner, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', signer, network);
  const result = await contract.setTimelockApproval(contractAddress, tokenId, operator);
  return result;
}

/// @notice Sets an Operator as Approved to Discharge/Release/Timelock a specific Token
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param operator         The Address of the Operator to Approve
export const setApprovalForAll = async (contractAddress:String, tokenId:BigNumberish, operator:String, signer:MultiSigner, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', signer, network);
  const result = await contract.setApprovalForAll(contractAddress, tokenId, operator);
  return result;
}

/// @dev Updates Restrictions on Energizing an NFT
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param state            The state of the permission (true or false)
export const setPermsForRestrictCharge = async (contractAddress:String, tokenId:BigNumberish, state:boolean, signer:MultiSigner, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', signer, network);
  const result = await contract.setPermsForRestrictChange(contractAddress, tokenId, state);
  return result;
}

/// @dev Updates Allowance on Discharging an NFT by Anyone
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param state            The state of the permission (true or false)
export const setPermsForAllowDischarge = async (contractAddress:String, tokenId:BigNumberish, state:boolean, signer:MultiSigner, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', signer, network);
  const result = await contract.setPermsForAllowDischarge(contractAddress, tokenId, state);
  return result;
}

/// @dev Updates Restrictions on Covalent Bonds on an NFT
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param state            The state of the permission (true or false)
export const setPermsForRestrictBond = async (contractAddress:String, tokenId:BigNumberish, state:boolean, signer:MultiSigner, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', signer, network);
  const result = await contract.setPermsForRestrictBond(contractAddress, tokenId, state);
  return result;
}

/// @dev Updates Allowance on Breaking Covalent Bonds on an NFT by Anyone
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param state            The state of the permission (true or false)
export const setPermsForAllowBreakBond = async (contractAddress:String, tokenId:BigNumberish, state:boolean, signer:MultiSigner, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', signer, network);
  const result = await contract.setPermsForAllowBreakBond(contractAddress, tokenId, state);
  return result;
}

/// @notice Sets a Timelock on the ability to Discharge the Interest of a Particle
/// @param contractAddress  The Address to the NFT to Timelock
/// @param tokenId          The token ID of the NFT to Timelock
/// @param unlockBlock      The Ethereum Block-number to Timelock until (~15 seconds per block)
export const setDischargeTimelock = async (contractAddress:String, tokenId:BigNumberish, unlockBlock:BigNumberish, signer:MultiSigner, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', signer, network);
  const result = await contract.setDischargeTimelock(contractAddress, tokenId, unlockBlock);
  return result;
}

/// @notice Sets a Timelock on the ability to Release the Assets of a Particle
/// @param contractAddress  The Address to the NFT to Timelock
/// @param tokenId          The token ID of the NFT to Timelock
/// @param unlockBlock      The Ethereum Block-number to Timelock until (~15 seconds per block)
export const setReleaseTimelock = async (contractAddress:String, tokenId:BigNumberish, unlockBlock:BigNumberish, signer:MultiSigner, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', signer, network);
  const result = await contract.setReleaseTimelock(contractAddress, tokenId, unlockBlock);
  return result;
}

/// @notice Sets a Timelock on the ability to Break the Covalent Bond of a Particle
/// @param contractAddress  The Address to the NFT to Timelock
/// @param tokenId          The token ID of the NFT to Timelock
/// @param unlockBlock      The Ethereum Block-number to Timelock until (~15 seconds per block)
export const setBreakBondTimelock = async (contractAddress:String, tokenId:BigNumberish, unlockBlock:BigNumberish, signer:MultiSigner, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedState', signer, network);
  const result = await contract.setBreakBondTimelock(contractAddress, tokenId, unlockBlock);
  return result;
}