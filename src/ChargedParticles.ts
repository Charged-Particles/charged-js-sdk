import ChargedParticles from "./abis/v2/ChargedParticles.json";
import { ethers, Wallet, providers, Signer, BigNumberish } from 'ethers';
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

type MultiSigner = ethers.Signer |
   ethers.VoidSigner |
   ethers.Wallet |
   ethers.providers.JsonRpcSigner;

// Boilerplate. Returns the CP contract with the correct provider
// TODO: should monitor address and chain ID change, throw error if not supported. 
// TODO: donot pass network to methods, get it from provider.

export const initContract = (
  provider?:providers.Provider, 
  network?:Networkish,
  signer?: Wallet | Signer,
  ) => {
   const networkFormatted: string = getFormatedromNetwork(network);
   const address: string = getAddressByNetwork(networkFormatted);

   let chargedParticleCOntract = new ethers.Contract(
      address,
      ChargedParticles,
      provider
   );

   if(signer && provider) {
    const connectedWallet = signer.connect(provider)
    chargedParticleCOntract = chargedParticleCOntract.connect(connectedWallet);
   }

   return chargedParticleCOntract;
}

export const getAddressByNetwork = (networkFormatted: string) => {
   let address:string;
   switch(networkFormatted) {
      case 'mainnet': address = mainnetAddresses.chargedParticles.address; break;
      case 'kovan': address = kovanAddresses.chargedParticles.address; break;
      case 'polygon': address = polygonAddresses.chargedParticles.address; break;
      case 'mumbai': address = mumbaiAddresses.chargedParticles.address; break;
      default: address = mainnetAddresses.chargedParticles.address; break;
   }

   return address;
}

// Create a contract with a signer attached. Signer is required as there is no default to use.
const initSignerContract = (signer:ethers.Signer, network?:Networkish) => {
   if(!signer) {
      throw 'No signer passed. Cannot continue.';
   }
   const networkFormatted: string = getFormatedromNetwork(network);
   const address: string = getAddressByNetwork(networkFormatted);

   return new ethers.Contract(
      address,
      ChargedParticles,
      signer
   );
}

// Charged Particles is only deployed on Mainnet, Kovan, Polygon, and Mumbai
export const getFormatedromNetwork = (network?:Networkish) => {
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

/***********************************|
|             Getters               |
|__________________________________*/

/// @notice returns the state adress from the ChargedParticles contract
/// @param provider - optional parameter. if not defined the code will use the ethers default provider.
/// @returns string of state address
export const getStateAddress = async (provider?:providers.Provider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   const stateAddress:String = await contract.getStateAddress();
   return stateAddress;
}

/// @notice returns the settings adress from the ChargedParticles contract
/// @param provider - optional parameter. if not defined the code will use the ethers default provider.
/// @returns string of settings address
export const getSettingsAddress = async (provider?:providers.Provider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   const settingsAddress:String = await contract.getSettingsAddress();
   return settingsAddress;
}

/// @notice returns the managers adress from the ChargedParticles contract
/// @param provider - optional parameter. if not defined the code will use the ethers default provider.
/// @returns string of settings address
export const getManagersAddress = async (provider?:providers.Provider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   const managersAddress:String = await contract.getManagersAddress();
   return managersAddress;
}

/// @notice Calculates the amount of Fees to be paid for a specific deposit amount
/// @param provider - optional parameter. if not defined the code will use the ethers default provider.
/// @param assetAmount - a wei string of amount of assets to calculate fees on
/// @returns the amount of protocol fees for the protocol as a big number
export const getFeesForDeposit = async (assetAmount:BigNumberish,  provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   const protocolFee = await contract.getFeesForDeposit(assetAmount);
   return protocolFee;
}

/// @notice Gets the Amount of Asset Tokens that have been Deposited into the Particle
/// representing the Mass of the Particle.
/// @param contractAddress      The Address to the Contract of the Token
/// @param tokenId              The ID of the Token
/// @param walletManagerId  The Liquidity-Provider ID to check the Asset balance of
/// @param assetToken           The Address of the Asset Token to check
/// @return The Amount of underlying Assets held within the Token as a big number
export const getBaseParticleMass = async (contractAddress:String, tokenId:BigNumberish, walletManagerId:String, assetToken:String, provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   const particleMass = await contract.callStatic.baseParticleMass(contractAddress, tokenId, walletManagerId, assetToken);
   return particleMass;
}

/// @notice Gets the amount of Interest that the Particle has generated representing
/// the Charge of the Particle
/// @param contractAddress      The Address to the Contract of the Token
/// @param tokenId              The ID of the Token
/// @param walletManagerId  The Liquidity-Provider ID to check the Interest balance of
/// @param assetToken           The Address of the Asset Token to check
/// @return The amount of interest the Token has generated (in Asset Token) as a big number
export const getCurrentParticleCharge = async (contractAddress:String, tokenId:BigNumberish, walletManagerId:String, assetToken:String, provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   const currentParticleCharge = await contract.callStatic.currentParticleCharge(contractAddress, tokenId, walletManagerId, assetToken);
   return currentParticleCharge;
}

/// @notice Gets the amount of LP Tokens that the Particle has generated representing
/// the Kinetics of the Particle
/// @param contractAddress      The Address to the Contract of the Token
/// @param tokenId              The ID of the Token
/// @param walletManagerId  The Liquidity-Provider ID to check the Kinetics balance of
/// @param assetToken           The Address of the Asset Token to check
/// @return The amount of LP tokens that have been generated as a big number
export const getParticleKinetics = async (contractAddress:String, tokenId:BigNumberish, walletManagerId:String, assetToken:String, provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   const currentParticleKinetics = await contract.callStatic.currentParticleKinetics(contractAddress, tokenId, walletManagerId, assetToken);
   return currentParticleKinetics;
}

/// @notice Gets the total amount of ERC721 Tokens that the Particle holds
/// @param contractAddress  The Address to the Contract of the Token
/// @param tokenId          The ID of the Token
/// @param basketManagerId  The ID of the BasketManager to check the token balance of
/// @return The total amount of ERC721 tokens that are held  within the Particle
export const getParicleCovalentBonds = async (contractAddress:String, tokenId:BigNumberish, walletManagerId:String, provider?:MultiProvider, network?:Networkish) => {
   const contract:ethers.Contract = initContract(provider, network);
   const currentParticleCovalentBonds = await contract.callStatic.currentParticleCovalentBonds(contractAddress, tokenId, walletManagerId);
   return currentParticleCovalentBonds;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// WRITE FUNCTIONS ** Signer required
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/***********************************|
|        Energize Particles         |
|__________________________________*/

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
export const energizeParticle = async (contractAddress:String, tokenId:BigNumberish, walletManagerId:String, assetToken:String, assetAmount:BigNumberish, signer:MultiSigner, network?:Networkish) => {
   const contract:ethers.Contract = initSignerContract(signer, network);
   const yieldTokensAmount = await contract.energizeParticle(contractAddress, tokenId, walletManagerId, assetToken, assetAmount);
   return yieldTokensAmount;
}

/***********************************|
|        Discharge Particles        |
|__________________________________*/

/// @notice Allows the owner or operator of the Token to collect or transfer the interest generated
///         from the token without removing the underlying Asset that is held within the token.
/// @param receiver             The Address to Receive the Discharged Asset Tokens
/// @param contractAddress      The Address to the Contract of the Token to Discharge
/// @param tokenId              The ID of the Token to Discharge
/// @param walletManagerId      The Wallet Manager of the Assets to Discharge from the Token
/// @param assetToken           The Address of the Asset Token being discharged
/// @return creatorAmount Amount of Asset Token discharged to the Creator
/// @return receiverAmount Amount of Asset Token discharged to the Receiver
export const dischargeParticle = async (receiver:String, contractAddress:String, tokenId:BigNumberish, walletManagerId:String, assetToken:String, signer:MultiSigner, network?:Networkish) => {
   const contract:ethers.Contract = initSignerContract(signer, network);
   const amounts = await contract.dischargeParticle(receiver, contractAddress, tokenId, walletManagerId, assetToken);
   return amounts;
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
export const dischargeParticleAmount = async (receiver:String, contractAddress:String, tokenId:BigNumberish, walletManagerId:String, assetToken:String, assetAmount:BigNumberish, signer:MultiSigner, network?:Networkish) => {
   const contract:ethers.Contract = initSignerContract(signer, network);
   const amounts = await contract.dischargeParticleAmount(receiver, contractAddress, tokenId, walletManagerId, assetToken, assetAmount);
   return amounts;
}

/// @notice Allows the Creator of the Token to collect or transfer a their portion of the interest (if any)
///         generated from the token without removing the underlying Asset that is held within the token.
/// @param receiver             The Address to Receive the Discharged Asset Tokens
/// @param contractAddress      The Address to the Contract of the Token to Discharge
/// @param tokenId              The ID of the Token to Discharge
/// @param walletManagerId  The Wallet Manager of the Assets to Discharge from the Token
/// @param assetToken           The Address of the Asset Token being discharged
/// @param assetAmount          The specific amount of Asset Token to Discharge from the Particle
/// @return receiverAmount      Amount of Asset Token discharged to the Receiver
export const dischargeParticleForCreator = async (receiver:String, contractAddress:String, tokenId:BigNumberish, walletManagerId:String, assetToken:String, assetAmount:BigNumberish, signer:MultiSigner, network?:Networkish) => {
   const contract:ethers.Contract = initSignerContract(signer, network);
   const receiverAmount = await contract.dischargeParticleForCreator(receiver, contractAddress, tokenId, walletManagerId, assetToken, assetAmount);
   return receiverAmount;
}

/***********************************|
|         Release Particles         |
|__________________________________*/

/// @notice Releases the Full amount of Asset + Interest held within the Particle by LP of the Assets
/// @param receiver             The Address to Receive the Released Asset Tokens
/// @param contractAddress      The Address to the Contract of the Token to Release
/// @param tokenId              The ID of the Token to Release
/// @param walletManagerId  The Wallet Manager of the Assets to Release from the Token
/// @param assetToken           The Address of the Asset Token being released
/// @return creatorAmount Amount of Asset Token released to the Creator
/// @return receiverAmount Amount of Asset Token released to the Receiver (includes principalAmount)
export const releaseParticle = async (receiver:String, contractAddress:String, tokenId:BigNumberish, walletManagerId:String, assetToken:String, signer:MultiSigner, network?:Networkish) => {
   const contract:ethers.Contract = initSignerContract(signer, network);
   const amounts = await contract.releaseParticle(receiver, contractAddress, tokenId, walletManagerId, assetToken);
   return amounts;
}

/// @notice Releases a partial amount of Asset + Interest held within the Particle by LP of the Assets
/// @param receiver             The Address to Receive the Released Asset Tokens
/// @param contractAddress      The Address to the Contract of the Token to Release
/// @param tokenId              The ID of the Token to Release
/// @param walletManagerId      The Wallet Manager of the Assets to Release from the Token
/// @param assetToken           The Address of the Asset Token being released
/// @param assetAmount          The specific amount of Asset Token to Release from the Particle
/// @return creatorAmount Amount of Asset Token released to the Creator
/// @return receiverAmount Amount of Asset Token released to the Receiver (includes principalAmount)
export const releaseParticleAmount = async (receiver:String, contractAddress:String, tokenId:BigNumberish, walletManagerId:String, assetToken:String, assetAmount:BigNumberish, signer:MultiSigner, network?:Networkish) => {
   const contract:ethers.Contract = initSignerContract(signer, network);
   const amounts = await contract.releaseParticleAmount(receiver, contractAddress, tokenId, walletManagerId, assetToken, assetAmount);
   return amounts;
}


/***********************************|
|         Covalent Bonding          |
|__________________________________*/

/// @notice Deposit other NFT Assets into the Particle
///    Must be called by the account providing the Asset
///    Account must Approve THIS contract as Operator of Asset
///
/// @param contractAddress      The Address to the Contract of the Token to Energize
/// @param tokenId              The ID of the Token to Energize
/// @param basketManagerId      The Basket to Deposit the NFT into
/// @param nftTokenAddress      The Address of the NFT Token being deposited
/// @param nftTokenId           The ID of the NFT Token being deposited
/// @param nftTokenAmount       The amount of Tokens to Deposit (ERC1155-specific)
export const covalentBond = async (contractAddress:String, tokenId:BigNumberish, basketManagerId:String, nftTokenAddress:String, nftTokenId:BigNumberish, nftTokenAmount:BigNumberish, signer:MultiSigner, network?:Networkish) => {
   const contract:ethers.Contract = initSignerContract(signer, network);
   const success = await contract.covalentBond(contractAddress, tokenId, basketManagerId, nftTokenAddress, nftTokenId, nftTokenAmount);
   return success;
}

/// @notice Release NFT Assets from the Particle
/// @param receiver             The Address to Receive the Released Asset Tokens
/// @param contractAddress      The Address to the Contract of the Token to Energize
/// @param tokenId              The ID of the Token to Energize
/// @param basketManagerId      The Basket to Deposit the NFT into
/// @param nftTokenAddress      The Address of the NFT Token being deposited
/// @param nftTokenId           The ID of the NFT Token being deposited
/// @param nftTokenAmount       The amount of Tokens to Withdraw (ERC1155-specific)
export const breakCovalentBond = async (contractAddress:String, tokenId:BigNumberish, basketManagerId:String, nftTokenAddress:String, nftTokenId:BigNumberish, nftTokenAmount:BigNumberish, signer:MultiSigner, network?:Networkish) => {
   const contract:ethers.Contract = initSignerContract(signer, network);
   const success = await contract.breakCovalentBond(contractAddress, tokenId, basketManagerId, nftTokenAddress, nftTokenId, nftTokenAmount);
   return success;
}
