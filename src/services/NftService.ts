import { BigNumberish, ethers } from 'ethers';
import { Networkish } from '@ethersproject/networks';
import { Configuration } from '../types';
import { getAbi } from '../utils/initContract';
import { SUPPORTED_NETWORKS } from '../utils/getAddressFromNetwork';
import BaseService from './baseService';


export default class NftService extends BaseService {
  public contractAddress: string;

  public tokenId: number;

  constructor(
    config: Configuration,
    contractAddress: string,
    tokenId: number,
  ) {
    super(config);
    this.contractAddress = contractAddress;
    this.tokenId = tokenId;
  }

  public async getChainIdsForBridgedNFTs() {
    const { providers } = this.config;

    const tokenChainIds: Networkish[] = [];
    
    try {
      for await (const network of SUPPORTED_NETWORKS) {
        let chainId = network.chainId;
        
        let provider = providers[chainId];
        
        if(provider == undefined) {
          const _network = ethers.providers.getNetwork(chainId);
          if (Boolean(_network?._defaultProvider)) {
            provider = ethers.getDefaultProvider(_network);
          } else {
            continue;
          }
        }

        const contractExists = await provider.getCode(this.contractAddress);

        if (contractExists !== '0x') {// contract exists on respective network

          let contract = new ethers.Contract(
            this.contractAddress,
            getAbi('erc721'),
            provider
          );

          const signerAddress = await this.getSignerAddress();
          const owner = await contract.ownerOf(this.tokenId);

          if (signerAddress.toLowerCase() == owner.toLowerCase()) {
            tokenChainIds.push(Number(chainId));
          }

        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }

    // if we find it is on multiple chains, then we have to find the owner of nft and store it for each chain
    // when we go to write check if the owner matches the signer
    return tokenChainIds;
  }

  public async bridgeNFTCheck(signerNetwork: Networkish) {
    const tokenChainIds = await this.getChainIdsForBridgedNFTs();

    if (tokenChainIds.includes(signerNetwork)) { return true }; // TODO: store this in class and retrieve to avoid expensive calls.

    throw new Error(`Signer network: ${signerNetwork}, does not match provider chain.`)
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
  /// @return The Amount of underlying Assets held within the Token as a BigNumber
  public async getMass( walletManagerId:managerId, assetToken:string ) {
    const parameters = [
      this.contractAddress, 
      this.tokenId, 
      walletManagerId, 
      assetToken
    ];
    return await this.fetchAllNetworks('chargedParticles', 'baseParticleMass', parameters, true);
  }

  /// @notice Gets the amount of Interest that the Particle has generated representing
  /// the Charge of the Particle
  /// @param walletManagerId  The Liquidity-Provider ID to check the Interest balance of
  /// @param assetToken           The Address of the Asset Token to check
  /// @return The amount of interest the Token has generated (in Asset Token) as a BigNumber
  public async getCharge( walletManagerId:managerId, assetToken:string ) {
    const parameters = [
      this.contractAddress, 
      this.tokenId, 
      walletManagerId, 
      assetToken
    ];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleCharge', parameters, true);
  }
  
  /// @notice Gets the amount of LP Tokens that the Particle has generated representing
  /// the Kinetics of the Particle
  /// @param walletManagerId  The Liquidity-Provider ID to check the Kinetics balance of
  /// @param assetToken           The Address of the Asset Token to check
  /// @return The amount of LP tokens that have been generated as a BigNumber
  public async getKinectics( walletManagerId:managerId, assetToken:string ) {
    const parameters = [
      this.contractAddress, 
      this.tokenId, 
      walletManagerId, 
      assetToken
    ];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleKinetics', parameters, true);
  }

  /// @notice Gets the total amount of ERC721 Tokens that the Particle holds
  /// @param basketManagerId  The ID of the BasketManager to check the token balance of
  /// @return The total amount of ERC721 tokens that are held  within the Particle as a BigNumber
  public async getBonds(basketManagerId: string) {
    const parameters = [this.contractAddress, this.tokenId, basketManagerId];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleCovalentBonds', parameters, true);
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
  /// @param chainId          Optional parameter that allows for the user to specify which network to write to.
  /// @return yieldTokensAmount The amount of Yield-bearing Tokens added to the escrow for the Token as a BigNumber
  public async energize( walletManagerId:managerId, assetToken:string, assetAmount:BigNumberish, chainId?:number, referrer?:string ) {

    const signerNetwork = await this.getSignerConnectedNetwork(chainId);

    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      this.contractAddress, 
      this.tokenId, 
      walletManagerId, 
      assetToken, 
      assetAmount, 
      referrer ?? '0x0000000000000000000000000000000000000000'
    ];
    return await this.callContract('chargedParticles', 'energizeParticle', signerNetwork, parameters);
  }

  /// @notice Allows the owner or operator of the Token to collect or transfer the interest generated
  ///         from the token without removing the underlying Asset that is held within the token.
  /// @param receiver             The Address to Receive the Discharged Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Discharge from the Token
  /// @param assetToken           The Address of the Asset Token being discharged
  /// @return creatorAmount       Amount of Asset Token discharged to the Creator as a BigNumber
  /// @return receiverAmount      Amount of Asset Token discharged to the Receiver as a BigNumber
  public async discharge( receiver:string, walletManagerId:managerId, assetToken:string, chainId?:number ) {
    
    const signerNetwork = await this.getSignerConnectedNetwork(chainId);

    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      receiver, 
      this.contractAddress, 
      this.tokenId, 
      walletManagerId, 
      assetToken
    ];
    return await this.callContract('chargedParticles', 'dischargeParticle', signerNetwork, parameters);
  }

  /// @notice Allows the owner or operator of the Token to collect or transfer a specific amount of the interest
  ///         generated from the token without removing the underlying Asset that is held within the token.
  /// @param receiver             The Address to Receive the Discharged Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Discharge from the Token
  /// @param assetToken           The Address of the Asset Token being discharged
  /// @param assetAmount          The specific amount of Asset Token to Discharge from the Token
  /// @return creatorAmount       Amount of Asset Token discharged to the Creator as a BigNumber
  /// @return receiverAmount      Amount of Asset Token discharged to the Receiver as a BigNumber
  public async dischargeAmount( receiver:string, walletManagerId:managerId, assetToken:string, assetAmount:BigNumberish, chainId?:number ) {
    
    const signerNetwork = await this.getSignerConnectedNetwork(chainId);

    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      receiver, 
      this.contractAddress, 
      this.tokenId, 
      walletManagerId, 
      assetToken, 
      assetAmount
    ];
    return await this.callContract('chargedParticles', 'dischargeParticleAmount', signerNetwork, parameters);
  }

  /// @notice Allows the Creator of the Token to collect or transfer a their portion of the interest (if any)
  ///         generated from the token without removing the underlying Asset that is held within the token.
  /// @param receiver             The Address to Receive the Discharged Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Discharge from the Token
  /// @param assetToken           The Address of the Asset Token being discharged
  /// @param assetAmount          The specific amount of Asset Token to Discharge from the Particle
  /// @return receiverAmount      Amount of Asset Token discharged to the Receiver as a BigNumber
  public async dischargeForCreator( receiver:string, walletManagerId:managerId, assetToken:string, assetAmount:BigNumberish, chainId?:number ) {
    
    const signerNetwork = await this.getSignerConnectedNetwork(chainId);

    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      receiver, 
      this.contractAddress, 
      this.tokenId, 
      walletManagerId, 
      assetToken, 
      assetAmount
    ];
    return await this.callContract('chargedParticles', 'dischargeParticleForCreator', signerNetwork, parameters);
  }


  /// @notice Releases the Full amount of Asset + Interest held within the Particle by LP of the Assets
  /// @param receiver             The Address to Receive the Released Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Release from the Token
  /// @param assetToken           The Address of the Asset Token being released
  /// @return creatorAmount       Amount of Asset Token released to the Creator as a BigNumber
  /// @return receiverAmount      Amount of Asset Token released to the Receiver (includes principalAmount) as a BigNumber
  public async release( receiver:string, walletManagerId:managerId, assetToken:string, chainId?:number ) {
    
    const signerNetwork = await this.getSignerConnectedNetwork(chainId);

    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      receiver, 
      this.contractAddress, 
      this.tokenId, 
      walletManagerId, 
      assetToken
    ];
    return await this.callContract('chargedParticles', 'releaseParticle', signerNetwork, parameters);
  }


  /// @notice Releases a partial amount of Asset + Interest held within the Particle by LP of the Assets
  /// @param receiver             The Address to Receive the Released Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Release from the Token
  /// @param assetToken           The Address of the Asset Token being released
  /// @param assetAmount          The specific amount of Asset Token to Release from the Particle
  /// @return creatorAmount Amount of Asset Token released to the Creator as a BigNumber
  /// @return receiverAmount Amount of Asset Token released to the Receiver (includes principalAmount) as a BigNumber
  public async releaseAmount( receiver:string, walletManagerId:managerId, assetToken:string, assetAmount:BigNumberish, chainId?:number ) {
    
    const signerNetwork = await this.getSignerConnectedNetwork(chainId);

    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      receiver, 
      this.contractAddress, 
      this.tokenId, 
      walletManagerId, 
      assetToken, 
      assetAmount
    ];
    return await this.callContract('chargedParticles', 'releaseParticleAmount', signerNetwork, parameters);
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
  public async bond( basketManagerId:string, nftTokenAddress:string, nftTokenId:string, nftTokenAmount:string, chainId?:number ) {
    
    const signerNetwork = await this.getSignerConnectedNetwork(chainId);

    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      this.contractAddress, 
      this.tokenId, 
      basketManagerId, 
      nftTokenAddress, 
      nftTokenId, 
      nftTokenAmount
    ];
    return await this.callContract('chargedParticles', 'covalentBond', signerNetwork, parameters);
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
  public async breakBond( receiver:string, basketManagerId:string, nftTokenAddress:string, nftTokenId:string, nftTokenAmount:string, chainId?:number ) {
    
    const signerNetwork = await this.getSignerConnectedNetwork(chainId);

    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      receiver, 
      this.contractAddress, 
      this.tokenId, 
      basketManagerId, 
      nftTokenAddress, 
      nftTokenId, 
      nftTokenAmount
    ];
    return await this.callContract('chargedParticles', 'breakCovalentBond', signerNetwork, parameters);
  }



  public async tokenURI() {
    return await this.fetchAllNetworks(
      'erc721', 
      'tokenURI', 
      [this.tokenId],
      false,
      this.contractAddress
    );
  }
}

type managerId = 'aave' | 'aave.B' | 'generic' | 'generic.B';

// enum managerId {
//   aave = 'aave',
//   aaveB = 'aave.B',
//   generic = 'generic',
//   genericB = 'generic.B'
// }
