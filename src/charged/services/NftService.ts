import { BigNumber, BigNumberish, ContractTransaction } from 'ethers';
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

        if (provider === void (0)) { continue };

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
    const { sdk } = this.state.configuration;

    if (!sdk?.NftBridgeCheck) { return };

    const tokenChainIds = await this.getChainIdsForBridgedNFTs();

    if (signerNetwork === void (0)) { throw new Error("Could not retrieve signers network.") };

    if (tokenChainIds.includes(signerNetwork)) { return true }; // TODO: store this in class and retrieve to avoid expensive calls.

    throw new Error(`Signer network: ${signerNetwork}, does not match provider chain.`)
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ChargedParticles functions
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /***********************************|
 |        Read Functions              |
 |__________________________________*/

  /**
   * Gets the amount of asset tokens that have been deposited into the Particle.
   *
   * @param {managerId} walletManagerId - The ID of the wallet manager to check.
   * @param {string} assetToken - The address of the asset token to check.
   * @return {BigNumber} The Amount of underlying assets held within the token.
   *
   */
  public async getMass(walletManagerId: managerId, assetToken: string) {
    const parameters = [
      this.contractAddress,
      this.tokenId,
      walletManagerId,
      assetToken
    ];
    return await this.fetchAllNetworks('chargedParticles', 'baseParticleMass', parameters);
  }

  /**
   * Gets the amount of interest that the particle has generated.
   *
   * @param {managerId} walletManagerId - The ID of the Wallet Manager.
   * @param {string} assetToken - The address of the asset Token to check.
   * @return {BigNumber} The amount of interest generated.
   *
   */
  public async getCharge(walletManagerId: managerId, assetToken: string) {
    const parameters = [
      this.contractAddress,
      this.tokenId,
      walletManagerId,
      assetToken
    ];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleCharge', parameters);
  }

  /**
   * Gets the amount of LP Tokens that the Particle has generated.
   *
   * @param {managerId} walletManagerId - The ID of the Wallet Manager.
   * @param {string} assetToken - The Address of the Asset Token to check.
   * @return {BigNumber} The amount of LP tokens that have been generated.
   *
   */
  public async getKinectics(walletManagerId: managerId, assetToken: string) {
    const parameters = [
      this.contractAddress,
      this.tokenId,
      walletManagerId,
      assetToken
    ];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleKinetics', parameters);
  }

  /**
   * Gets the total amount of ERC721 tokens that the Particle holds.
   *
   * @param {string} basketManagerId - The ID of the BasketManager to check.
   * @return {BigNumber} The total amount of ERC721 tokens that are held within the Particle.
   *
   */
  public async getBonds(basketManagerId: string) {
    const parameters = [this.contractAddress, this.tokenId, basketManagerId];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleCovalentBonds', parameters);
  }

  /**
   * Gets the amount of creator annuities reserved for the creator for the specified NFT.
   *
   * @return {address} The address of the creator.
   * @return {number} The percentage amount of annuities reserved for the creator.
   *
   */
  public async getCreatorAnnuities() {
    const parameters = [this.contractAddress, this.tokenId];
    return await this.fetchAllNetworks('chargedSettings', 'getCreatorAnnuities', parameters);
  }

  /**
   * Get the address that receives creator annuities for a given Particle/ Defaults to creator address if it has not been redirected.
   *
   * @return {address} The address of the creator.
   * @return {number} The percentage amount of annuities reserved for the creator.
   *
   */
  public async getCreatorAnnuitiesRedirect() {
    const parameters = [this.contractAddress, this.tokenId];
    return await this.fetchAllNetworks('chargedSettings', 'getCreatorAnnuitiesRedirect', parameters);
  }

  /**
   * Gets the tokenUri using the tokenId and contractAddress of the Particle.
   *
   * @return {string} Token metadata URI.
   *
   */
  public async tokenURI() {
    return await this.fetchAllNetworks(
      'erc721',
      'tokenURI',
      [this.tokenId],
      this.contractAddress,
    );
  }

  /**
   * Gets the Discharge timelock state of the Particle.
   *
   * @param {string} sender - The address approved for Discharging assets from the Particle.
   * @return {[boolean, boolean, BigNumber, BigNumber]} [allowFromAll, isApproved, timelock, empLockExpiry]
   */
  public async getDischargeState(sender: string) {
    const parameters = [this.contractAddress, this.tokenId, sender];
    return await this.fetchAllNetworks(
      'chargedState',
      'getDischargeState',
      parameters
    );
  }

  /**
   * Gets the Discharge timelock state of the Particle.
   *
   * @param {string} sender - The address approved for Releasing assets from the Particle.
   * @return {[boolean, boolean, BigNumber, BigNumber]} [allowFromAll, isApproved, timelock, empLockExpiry]
   *
   */
  public async getReleaseState(sender: string) {
    const parameters = [this.contractAddress, this.tokenId, sender];
    return await this.fetchAllNetworks(
      'chargedState',
      'getReleaseState',
      parameters
    );
  }

  /**
   * Gets the Bonds Timelock state of the Particle.
   *
   * @param {string} sender - The address approved for removing Bond assets from the Particle.
   * @return {boolean} allowFromAll
   * @return {boolean} isApproved
   * @return {BigNumber} timelock
   * @return {BigNumber} empLockExpiry
   *
   */
  public async getBondsState(sender: string) {
    const parameters = [this.contractAddress, this.tokenId, sender];
    return await this.fetchAllNetworks(
      'chargedState',
      'getBreakBondState',
      parameters
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
    nftTokenAmount: BigNumberish,
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
    nftTokenAmount: BigNumberish,
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

  /// @notice Sets a Timelock on the ability to Release the Assets of a Particle
  /// @param contractAddress  The Address to the NFT to Timelock
  /// @param tokenId          The token ID of the NFT to Timelock
  /// @param unlockBlock      The Ethereum Block-number to Timelock until (~15 seconds per block)
  public async releaseTimelock(
    unlockBlock: number,
    chainId?: number
  ) {

    const signerNetwork = await this.getSignerConnectedNetwork(chainId);
    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      this.contractAddress,
      this.tokenId,
      unlockBlock,
    ];

    const tx: ContractTransaction = await this.writeContract(
      'chargedState',
      'setReleaseTimelock',
      signerNetwork,
      parameters
    );

    const receipt = await tx.wait();
    return receipt;
  }

  /// @notice Sets a Timelock on the ability to Discharge the Interest of a Particle
  /// @param contractAddress  The Address to the NFT to Timelock
  /// @param tokenId          The token ID of the NFT to Timelock
  /// @param unlockBlock      The Ethereum Block-number to Timelock until (~15 seconds per block)
  public async dischargeTimelock(
    unlockBlock: number,
    chainId?: number
  ) {

    const signerNetwork = await this.getSignerConnectedNetwork(chainId);
    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      this.contractAddress,
      this.tokenId,
      unlockBlock,
    ];

    const tx: ContractTransaction = await this.writeContract(
      'chargedState',
      'setDischargeTimelock',
      signerNetwork,
      parameters
    );

    const receipt = await tx.wait();
    return receipt;
  }

  /// @notice Sets a Timelock on the ability to Break the Covalent Bond of a Particle
  /// @param contractAddress  The Address to the NFT to Timelock
  /// @param tokenId          The token ID of the NFT to Timelock
  /// @param unlockBlock      The Ethereum Block-number to Timelock until (~15 seconds per block)
  public async bondsTimelock(
    unlockBlock: number,
    chainId?: number
  ) {

    const signerNetwork = await this.getSignerConnectedNetwork(chainId);
    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      this.contractAddress,
      this.tokenId,
      unlockBlock,
    ];

    const tx: ContractTransaction = await this.writeContract(
      'chargedState',
      'setBreakBondTimelock',
      signerNetwork,
      parameters
    );

    const receipt = await tx.wait();
    return receipt;
  }

  /// @notice Sets the custom configuration for creators of proton-based NFTs
  /// @param creator          The creator of the Proton-based NFT
  /// @param annuityPercent   The percentage of interest-annuities to reserve for the creator
  public async setCreatorAnnuities(creator: string, annuityPercent: BigNumberish, chainId?: number) {

    const signerNetwork = await this.getSignerConnectedNetwork(chainId);
    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      this.contractAddress,
      this.tokenId,
      creator,
      annuityPercent,
    ];

    const tx: ContractTransaction = await this.writeContract(
      'chargedSettings',
      'setCreatorAnnuities',
      signerNetwork,
      parameters
    )

    const receipt = await tx.wait();
    return receipt;
  }

  /// @notice Sets a custom receiver address for the creator annuities
  /// @param receiver         The receiver of the Creator interest-annuities
  public async setCreatorAnnuitiesRedirect(receiver: string, chainId?: number) {

    const signerNetwork = await this.getSignerConnectedNetwork(chainId);
    await this.bridgeNFTCheck(signerNetwork);

    const parameters = [
      this.contractAddress,
      this.tokenId,
      receiver,
    ];

    const tx: ContractTransaction = await this.writeContract(
      'chargedSettings',
      'setCreatorAnnuitiesRedirect',
      signerNetwork,
      parameters
    )

    const receipt = await tx.wait();
    return receipt;
  }

}