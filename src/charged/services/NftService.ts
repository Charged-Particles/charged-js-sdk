import { BigNumberish, ContractTransaction } from 'ethers';
import { ChargedState, managerId } from '../../types';
import BaseService from './baseService';

export default class NftService extends BaseService {
  public contractAddress: string;

  public tokenId: number;

  constructor(
    state: ChargedState,
    contractAddress: string,
    tokenId: number,
  ) {
    super(state);
    this.contractAddress = contractAddress;
    this.tokenId = tokenId;
  }

  public async getChainIdsForBridgedNFTs(): Promise<number[]> {
    const { providers } = this.state;

    const tokenChainIds: number[] = [];

    try {
      for (const chainId in providers) {
        let provider = providers[chainId];

        if (provider === void(0)) { continue };

        const contractExists = await provider.getCode(this.contractAddress);

        if (contractExists !== '0x') { // contract exists on respective network
          if (chainId == 'external') {
            const { chainId } = await provider.getNetwork();
            tokenChainIds.push(chainId);
          } else {
            tokenChainIds.push(Number(chainId));
          }
        }
      }
    } catch (error) {
      throw error;
    }

    // if we find it is on multiple chains, then we have to find the owner of nft and store it for each chain
    // when we go to write check if the owner matches the signer
    return tokenChainIds;
  }

  public async bridgeNFTCheck(signerNetwork: number) {
    const tokenChainIds = await this.getChainIdsForBridgedNFTs();

    if (signerNetwork === void(0)) { throw new Error("Could not retrieve signers network.") };

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
  public async getMass(walletManagerId: managerId, assetToken: string) {
    const parameters = [
      this.contractAddress,
      this.tokenId,
      walletManagerId,
      assetToken
    ];
    return await this.fetchAllNetworks('chargedParticles', 'baseParticleMass', parameters);
  }

  /// @notice Gets the amount of Interest that the Particle has generated representing
  /// the Charge of the Particle
  /// @param walletManagerId  The Liquidity-Provider ID to check the Interest balance of
  /// @param assetToken           The Address of the Asset Token to check
  /// @return The amount of interest the Token has generated (in Asset Token) as a BigNumber
  public async getCharge(walletManagerId: managerId, assetToken: string) {
    const parameters = [
      this.contractAddress,
      this.tokenId,
      walletManagerId,
      assetToken
    ];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleCharge', parameters);
  }

  /// @notice Gets the amount of LP Tokens that the Particle has generated representing
  /// the Kinetics of the Particle
  /// @param walletManagerId  The Liquidity-Provider ID to check the Kinetics balance of
  /// @param assetToken           The Address of the Asset Token to check
  /// @return The amount of LP tokens that have been generated as a BigNumber
  public async getKinectics(walletManagerId: managerId, assetToken: string) {
    const parameters = [
      this.contractAddress,
      this.tokenId,
      walletManagerId,
      assetToken
    ];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleKinetics', parameters);
  }

  /// @notice Gets the total amount of ERC721 Tokens that the Particle holds
  /// @param basketManagerId  The ID of the BasketManager to check the token balance of
  /// @return The total amount of ERC721 tokens that are held  within the Particle as a BigNumber
  public async getBonds(basketManagerId: string) {
    const parameters = [this.contractAddress, this.tokenId, basketManagerId];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleCovalentBonds', parameters);
  }

  public async tokenURI() {
    return await this.fetchAllNetworks(
      'erc721',
      'tokenURI',
      [this.tokenId],
      this.contractAddress,
    );
  }

  /***********************************|
 |        Write Functions             |
 |__________________________________*/

  /// @notice Fund Particle with Asset Token
  ///    Must be called by the account providing the Asset
  ///    Account must Approve THIS contract as Operator of Asset
  ///
  /// @param walletManagerId  The Asset-Pair to Energize the Token with
  /// @param assetToken       The Address of the Asset Token being used
  /// @param assetAmount      The Amount of Asset Token to Energize the Token with
  /// @param referrer          
  /// @param chainId          Optional parameter that allows for the user to specify which network to write to.
  /// @return yieldTokensAmount The amount of Yield-bearing Tokens added to the escrow for the Token as a BigNumber
  public async energize(
    walletManagerId: managerId,
    assetToken: string,
    assetAmount: BigNumberish,
    chainId?: number,
    referrer?: string
  ) {

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
    const tx: ContractTransaction = await this.writeContract(
      'chargedParticles',
      'energizeParticle',
      signerNetwork,
      parameters
    );
    const receipt = await tx.wait();
    return receipt;
  }

  /// @notice Allows the owner or operator of the Token to collect or transfer the interest generated
  ///         from the token without removing the underlying Asset that is held within the token.
  /// @param receiver             The Address to Receive the Discharged Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Discharge from the Token
  /// @param assetToken           The Address of the Asset Token being discharged
  /// @return creatorAmount       Amount of Asset Token discharged to the Creator as a BigNumber
  /// @return receiverAmount      Amount of Asset Token discharged to the Receiver as a BigNumber
  public async discharge(
    receiver: string,
    walletManagerId: managerId,
    assetToken: string,
    chainId?: number
  ) {

    const signerNetwork = await this.getSignerConnectedNetwork(chainId);

    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      receiver,
      this.contractAddress,
      this.tokenId,
      walletManagerId,
      assetToken
    ];
    const tx: ContractTransaction = await this.writeContract(
      'chargedParticles',
      'dischargeParticle',
      signerNetwork,
      parameters
    );
    const receipt = await tx.wait();
    return receipt;
  }

  /// @notice Allows the owner or operator of the Token to collect or transfer a specific amount of the interest
  ///         generated from the token without removing the underlying Asset that is held within the token.
  /// @param receiver             The Address to Receive the Discharged Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Discharge from the Token
  /// @param assetToken           The Address of the Asset Token being discharged
  /// @param assetAmount          The specific amount of Asset Token to Discharge from the Token
  /// @return creatorAmount       Amount of Asset Token discharged to the Creator as a BigNumber
  /// @return receiverAmount      Amount of Asset Token discharged to the Receiver as a BigNumber
  public async dischargeAmount(
    receiver: string,
    walletManagerId: managerId,
    assetToken: string,
    assetAmount: BigNumberish,
    chainId?: number
  ) {

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
    const tx: ContractTransaction = await this.writeContract(
      'chargedParticles',
      'dischargeParticleAmount',
      signerNetwork,
      parameters
    );
    const receipt = await tx.wait();
    return receipt;
  }

  /// @notice Allows the Creator of the Token to collect or transfer a their portion of the interest (if any)
  ///         generated from the token without removing the underlying Asset that is held within the token.
  /// @param receiver             The Address to Receive the Discharged Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Discharge from the Token
  /// @param assetToken           The Address of the Asset Token being discharged
  /// @param assetAmount          The specific amount of Asset Token to Discharge from the Particle
  /// @return receiverAmount      Amount of Asset Token discharged to the Receiver as a BigNumber
  public async dischargeForCreator(
    receiver: string,
    walletManagerId: managerId,
    assetToken: string,
    assetAmount: BigNumberish,
    chainId?: number
  ) {

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
    const tx: ContractTransaction = await this.writeContract(
      'chargedParticles',
      'dischargeParticleForCreator',
      signerNetwork,
      parameters
    );
    const receipt = await tx.wait();
    return receipt;
  }


  /// @notice Releases the Full amount of Asset + Interest held within the Particle by LP of the Assets
  /// @param receiver             The Address to Receive the Released Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Release from the Token
  /// @param assetToken           The Address of the Asset Token being released
  /// @return creatorAmount       Amount of Asset Token released to the Creator as a BigNumber
  /// @return receiverAmount      Amount of Asset Token released to the Receiver (includes principalAmount) as a BigNumber
  public async release(
    receiver: string,
    walletManagerId: managerId,
    assetToken: string,
    chainId?: number
  ) {

    const signerNetwork = await this.getSignerConnectedNetwork(chainId);

    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      receiver,
      this.contractAddress,
      this.tokenId,
      walletManagerId,
      assetToken
    ];
    const tx: ContractTransaction = await this.writeContract(
      'chargedParticles',
      'releaseParticle',
      signerNetwork,
      parameters
    );
    const receipt = await tx.wait();
    return receipt;
  }


  /// @notice Releases a partial amount of Asset + Interest held within the Particle by LP of the Assets
  /// @param receiver             The Address to Receive the Released Asset Tokens
  /// @param walletManagerId      The Wallet Manager of the Assets to Release from the Token
  /// @param assetToken           The Address of the Asset Token being released
  /// @param assetAmount          The specific amount of Asset Token to Release from the Particle
  /// @return creatorAmount Amount of Asset Token released to the Creator as a BigNumber
  /// @return receiverAmount Amount of Asset Token released to the Receiver (includes principalAmount) as a BigNumber
  public async releaseAmount(
    receiver: string,
    walletManagerId: managerId,
    assetToken: string,
    assetAmount: BigNumberish,
    chainId?: number
  ) {

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
    const tx: ContractTransaction = await this.writeContract(
      'chargedParticles',
      'releaseParticleAmount',
      signerNetwork,
      parameters
    );
    const receipt = await tx.wait();
    return receipt;
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
  public async bond(
    basketManagerId: string,
    nftTokenAddress: string,
    nftTokenId: string,
    nftTokenAmount: string,
    chainId?: number
  ) {

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
    const tx: ContractTransaction = await this.writeContract(
      'chargedParticles',
      'covalentBond',
      signerNetwork,
      parameters
    );

    const receipt = await tx.wait();
    return receipt;
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
  public async breakBond(
    receiver: string,
    basketManagerId: string,
    nftTokenAddress: string,
    nftTokenId: string,
    nftTokenAmount: string,
    chainId?: number
  ) {

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

    const tx: ContractTransaction = await this.writeContract(
      'chargedParticles',
      'breakCovalentBond',
      signerNetwork,
      parameters
    );

    const receipt = await tx.wait();
    return receipt;
  }
}