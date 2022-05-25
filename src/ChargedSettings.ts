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

/// @notice Gets the amount of creator annuities reserved for the creator for the specified NFT
/// @param contractAddress The Address to the Contract of the NFT
/// @param tokenId         The Token ID of the NFT
/// @return creator The address of the creator
/// @return annuityPct The percentage amount of annuities reserved for the creator
export const getCreatorAnnuities = async (contractAddress:String, tokenId:BigNumberish, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedSettings', provider, network);
  const returns = await contract.getCreatorAnnuities(contractAddress, tokenId);
  return returns;
}

// TODO: Add notice
/// @notice 
/// @param contractAddress The Address to the Contract of the NFT
/// @param tokenId         The Token ID of the NFT
/// @return redirect address
export const getCreatorAnnuitiesRedirect = async (contractAddress:String, tokenId:BigNumberish, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedSettings', provider, network);
  const redirectAddress = await contract.getCreatorAnnuitiesRedirect(contractAddress, tokenId);
  return redirectAddress;
}

// TODO: Add documentation
/// @notice 
/// @return timeLockExpiryBlock
export const getTempLockExpiryBlocks = async (provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedSettings', provider, network);
  const timeLockExpiryBlock = await contract.getTempLockExpiryBlocks();
  return timeLockExpiryBlock;
}

// TODO: Add documentation
/// @notice 
/// @param operator - address of operator
/// @return timelockAny
/// @return timelockOwn
export const getTimelockApprovals = async (operator:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedSettings', provider, network);
  const returns = await contract.getTimelockApprovals(operator);
  return returns;
}

// TODO: Add documentation
/// @notice 
/// @param contractAddress
/// @param assetToken
/// @return requiredWalletManager
/// @return energizeEnabled
/// @return restrictedAssets
/// @return validAsset
/// @return depositCap
/// @return depositMin
/// @return depositMax
/// @return invalidAsset
export const getAssetRequirements = async (contractAddress:String, assetToken:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedSettings', provider, network);
  const returns = await contract.getAssetRequirements(contractAddress, assetToken);
  return returns;
}

// TODO: Add documentation
/// @notice 
/// @param contractAddress
/// @param nftTokenAddress
/// @return requiredWalletManager
/// @return energizeEnabled
/// @return restrictedAssets
export const getNftAssetRequirements = async (contractAddress:String, nftTokenAddress:String, provider?:MultiProvider, network?:Networkish) => {
  const contract:ethers.Contract = initContract('chargedSettings', provider, network);
  const returns = await contract.getNftAssetRequirements(contractAddress, nftTokenAddress);
  return returns;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// WRITE FUNCTIONS ** Signer required
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~