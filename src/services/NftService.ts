import { BigNumberish } from 'ethers';
import { Configuration } from '../types';
import BaseService from './baseService';

/*
The NFT service uses functions that read and/or write with specific NFTs in mind. 
*/
export default class NftService extends BaseService {
  public contractAddress: string;

  public tokenId: number;

  public network: number;

  constructor(
    config: Configuration,
    contractAddress: string,
    tokenId: number,
    network: number // TODO: deduce network from passed particle address
  ) {
      super(config);
      
      this.contractAddress = contractAddress;
      this.tokenId = tokenId;
      this.network = network;
   }
    
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ChargedParticles functions
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

   /***********************************|
  |        Read Functions              |
  |__________________________________*/

  /// @notice Gets the Amount of Asset Tokens that have been Deposited into the Particle
  /// representing the Mass of the Particle.
  /// @param walletManagerId      The Liquidity-Provider ID to check the Asset balance of
  /// @param assetToken           The Address of the Asset Token to check
  /// @return The Amount of underlying Assets held within the Token
  public async getMass( walletManagerId: string, assetToken:string ) {
    const fullParameters = [this.contractAddress, this.tokenId, walletManagerId, assetToken];
    return await this.fetchAllNetworks('chargedParticles', 'baseParticleMass', fullParameters, true);
  }

  /// @notice Gets the amount of Interest that the Particle has generated representing
  /// the Charge of the Particle
  /// @param walletManagerId  The Liquidity-Provider ID to check the Interest balance of
  /// @param assetToken           The Address of the Asset Token to check
  /// @return The amount of interest the Token has generated (in Asset Token)
  public async getCharge( walletManagerId:string, assetToken:string ) {
    const fullParameters = [this.contractAddress, this.tokenId, walletManagerId, assetToken];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleCharge', fullParameters, true);
  }
  
  /// @notice Gets the amount of LP Tokens that the Particle has generated representing
  /// the Kinetics of the Particle
  /// @param walletManagerId  The Liquidity-Provider ID to check the Kinetics balance of
  /// @param assetToken           The Address of the Asset Token to check
  /// @return The amount of LP tokens that have been generated
  public async getKinectics( walletManagerId:string, assetToken:string ) {
    const fullParameters = [this.contractAddress, this.tokenId, walletManagerId, assetToken];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleKinetics', fullParameters, true);
  }

  /// @notice Gets the total amount of ERC721 Tokens that the Particle holds
  /// @param basketManagerId  The ID of the BasketManager to check the token balance of
  /// @return The total amount of ERC721 tokens that are held  within the Particle
  public async getBonds(basketManagerId: string) {
    const fullParameters = [this.contractAddress, this.tokenId, basketManagerId];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleCovalentBonds', fullParameters, true);
  }

   /***********************************|
  |        Write Functions             |
  |__________________________________*/

  /// @notice Fund Particle with Asset Token
  ///    Must be called by the account providing the Asset
  ///    Account must Approve THIS contract as Operator of Asset
  ///
  /// NOTE: DO NOT Energize an ERC20 Token, as anyone who holds any amount
  ///       of the same ERC20 token could discharge or release the funds.
  ///       All holders of the ERC20 token would essentially be owners of the Charged Particle.
  ///
  /// @param walletManagerId  The Asset-Pair to Energize the Token with
  /// @param assetToken       The Address of the Asset Token being used
  /// @param assetAmount      The Amount of Asset Token to Energize the Token with
  /// @param referrer         TODO: WHAT IS THIS?
  /// @return yieldTokensAmount The amount of Yield-bearing Tokens added to the escrow for the Token
  public async energize( walletManagerId:string, assetToken:string, assetAmount:BigNumberish, referrer:string ) {
    const fullParameters = [this.contractAddress, this.tokenId, walletManagerId, assetToken, assetAmount, referrer];
    return await this.callContract('chargedParticles', 'energizeParticle', this.network, fullParameters);
  }

  /// @notice Allows the owner or operator of the Token to collect or transfer the interest generated
  ///         from the token without removing the underlying Asset that is held within the token.
  /// @param receiver             The Address to Receive the Discharged Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Discharge from the Token
  /// @param assetToken           The Address of the Asset Token being discharged
  /// @return creatorAmount       Amount of Asset Token discharged to the Creator
  /// @return receiverAmount      Amount of Asset Token discharged to the Receiver
  public async discharge( receiver:string, walletManagerId:string, assetToken:string ) {
    const fullParameters = [receiver, this.contractAddress, this.tokenId, walletManagerId, assetToken];
    return await this.callContract('chargedParticles', 'dischargeParticle', this.network, fullParameters);
  }

  /// @notice Allows the owner or operator of the Token to collect or transfer a specific amount of the interest
  ///         generated from the token without removing the underlying Asset that is held within the token.
  /// @param receiver             The Address to Receive the Discharged Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Discharge from the Token
  /// @param assetToken           The Address of the Asset Token being discharged
  /// @param assetAmount          The specific amount of Asset Token to Discharge from the Token
  /// @return creatorAmount       Amount of Asset Token discharged to the Creator
  /// @return receiverAmount      Amount of Asset Token discharged to the Receiver
  public async dischargeAmount( receiver:string, walletManagerId:string, assetToken:string, assetAmount:BigNumberish ) {
    const fullParameters = [receiver, this.contractAddress, this.tokenId, walletManagerId, assetToken, assetAmount];
    return await this.callContract('chargedParticles', 'dischargeParticleAmount', this.network, fullParameters);
  }

  /// @notice Allows the Creator of the Token to collect or transfer a their portion of the interest (if any)
  ///         generated from the token without removing the underlying Asset that is held within the token.
  /// @param receiver             The Address to Receive the Discharged Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Discharge from the Token
  /// @param assetToken           The Address of the Asset Token being discharged
  /// @param assetAmount          The specific amount of Asset Token to Discharge from the Particle
  /// @return receiverAmount      Amount of Asset Token discharged to the Receiver
  public async dischargeForCreator( receiver:string, walletManagerId:string, assetToken:string, assetAmount:BigNumberish ) {
    const fullParameters = [receiver, this.contractAddress, this.tokenId, walletManagerId, assetToken, assetAmount];
    return await this.callContract('chargedParticles', 'dischargeParticleForCreator', this.network, fullParameters);
  }


  /// @notice Releases the Full amount of Asset + Interest held within the Particle by LP of the Assets
  /// @param receiver             The Address to Receive the Released Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Release from the Token
  /// @param assetToken           The Address of the Asset Token being released
  /// @return creatorAmount       Amount of Asset Token released to the Creator
  /// @return receiverAmount      Amount of Asset Token released to the Receiver (includes principalAmount)
  public async release( receiver:string, walletManagerId:string, assetToken:string ) {
    const fullParameters = [receiver, this.contractAddress, this.tokenId, walletManagerId, assetToken];
    return await this.callContract('chargedParticles', 'releaseParticle', this.network, fullParameters);
  }


  /// @notice Releases a partial amount of Asset + Interest held within the Particle by LP of the Assets
  /// @param receiver             The Address to Receive the Released Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Release from the Token
  /// @param assetToken           The Address of the Asset Token being released
  /// @param assetAmount          The specific amount of Asset Token to Release from the Particle
  /// @return creatorAmount Amount of Asset Token released to the Creator
  /// @return receiverAmount Amount of Asset Token released to the Receiver (includes principalAmount)
  public async releaseAmount( receiver:string, walletManagerId:string, assetToken:string, assetAmount:BigNumberish ) {
    const fullParameters = [receiver, this.contractAddress, this.tokenId, walletManagerId, assetToken, assetAmount];
    return await this.callContract('chargedParticles', 'releaseParticleAmount', this.network, fullParameters);
  }

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
  /// @returns success            boolean
  public async bond( basketManagerId:string, nftTokenAddress:string, nftTokenId:string, nftTokenAmount:string ) {
    const fullParameters = [this.contractAddress, this.tokenId, basketManagerId, nftTokenAddress, nftTokenId, nftTokenAmount];
    return await this.callContract('chargedParticles', 'covalentBond', this.network, fullParameters);
  }

  /// @notice Release NFT Assets from the Particle
  /// @param  receiver             The Address to Receive the Released Asset Tokens
  /// @param  contractAddress      The Address to the Contract of the Token to Energize
  /// @param  tokenId              The ID of the Token to Energize
  /// @param  basketManagerId      The Basket to Deposit the NFT into
  /// @param  nftTokenAddress      The Address of the NFT Token being deposited
  /// @param  nftTokenId           The ID of the NFT Token being deposited
  /// @param  nftTokenAmount       The amount of Tokens to Withdraw (ERC1155-specific)
  /// @returns success             boolean
  public async breakBond( receiver:string, basketManagerId:string, nftTokenAddress:string, nftTokenId:string, nftTokenAmount:string ) {
    const fullParameters = [receiver, this.contractAddress, this.tokenId, basketManagerId, nftTokenAddress, nftTokenId, nftTokenAmount];
    return await this.callContract('chargedParticles', 'breakCovalentBond', this.network, fullParameters);
  }



  public async tokenURI() {
    const tokenURI = await this.callContract('protonB', 'tokenURI', this.network, [this.tokenId]);
    return tokenURI;
  }
}
