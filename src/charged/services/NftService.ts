import { BigNumberish, ContractTransaction } from 'ethers';
import { ChargedState, ManagerId } from '../../types';
import BaseService from './baseService';

/** 
* @name NFT
* @class NFT
* 
* Returns a wrapped token with charged particle methods.
* @param {string} contractAddress
* @param {number} tokenId
* @return {NftService}  Instance of the NFT connected to the charged particle protocol
* 
* @example
* const charged = new Charged({providers: window.ethereum});
* 
* const nft = charged.NFT( '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963', 43);
* 
* const creatorAnnuities = await nft.getCreatorAnnuities();
* 
*/
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
   * @memberof NFT
   * @instance
   * @async
   *
   * @param {ManagerId} walletManagerId - The ID of the wallet manager to check.
   * @param {string} assetToken         - The address of the asset token to check.
   * @return {BigNumber}                - The Amount of underlying assets held within the token.
   */
  public async getMass(walletManagerId: ManagerId, assetToken: string) {
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
   * @memberof NFT
   * @instance
   * @async
   *
   * @param {ManagerId} walletManagerId - The ID of the Wallet Manager.
   * @param {string} assetToken         - The address of the asset Token to check.
   * @return {BigNumber}                - The amount of interest generated.
   *
   */
  public async getCharge(walletManagerId: ManagerId, assetToken: string) {
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
   * @memberof NFT
   * @instance
   * @async
   *
   * @param {ManagerId} walletManagerId - The ID of the Wallet Manager.
   * @param {string} assetToken         - The Address of the Asset Token to check.
   * @return {BigNumber}                - The amount of LP tokens that have been generated.
   *
   */
  public async getKinectics(walletManagerId: ManagerId, assetToken: string) {
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
   * @memberof NFT
   * @instance
   * @async
   *
   * @param {string} basketManagerId    - The ID of the BasketManager to check.
   * @return {BigNumber}                - The total amount of ERC721 tokens that are held within the Particle.
   *
   */
  public async getBonds(basketManagerId: string) {
    const parameters = [this.contractAddress, this.tokenId, basketManagerId];
    return await this.fetchAllNetworks('chargedParticles', 'currentParticleCovalentBonds', parameters);
  }

  /**
   * Gets the amount of creator annuities reserved for the creator for the specified NFT.
   * 
   * @memberof NFT
   * @instance
   * @async
   *
   * @return {address}                  - The address of the creator.
   * @return {number}                   - The percentage amount of annuities reserved for the creator.
   *
   */
  public async getCreatorAnnuities() {
    const parameters = [this.contractAddress, this.tokenId];
    return await this.fetchAllNetworks('chargedSettings', 'getCreatorAnnuities', parameters);
  }

  /**
   * Get the address that receives creator annuities for a given Particle/ Defaults to creator address if it has not been redirected.
   * 
   * @memberof NFT
   * @instance
   * @async
   *
   * @return {address}                  - The address of the creator.
   * @return {number}                   - The percentage amount of annuities reserved for the creator.
   *
   */
  public async getCreatorAnnuitiesRedirect() {
    const parameters = [this.contractAddress, this.tokenId];
    return await this.fetchAllNetworks('chargedSettings', 'getCreatorAnnuitiesRedirect', parameters);
  }

  /**
   * Gets the tokenUri using the tokenId and contractAddress of the Particle.
   * 
   * @memberof NFT
   * @instance
   * @async
   *
   * @return {string}                   - Token metadata URI.
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
   * @memberof NFT
   * @instance
   * @async
   *
   * @param {string} sender             - The address approved for Discharging assets from the Particle.
   * @return {[boolean, boolean, BigNumber, BigNumber]} - [allowFromAll, isApproved, timelock, empLockExpiry]
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
   * @memberof NFT
   * @instance
   * @async
   *
   * @param {string} sender             - The address approved for Releasing assets from the Particle.
   * @return {[boolean, boolean, BigNumber, BigNumber]} - [allowFromAll, isApproved, timelock, empLockExpiry]
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
   * @memberof NFT
   * @instance
   * @async
   *
   * @param {string} sender             - The address approved for removing Bond assets from the Particle.
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

  /**
  * Fund particle with asset token
  * Must be called by the account providing the asset. Account must also approve THIS contract as operator as asset.
  * 
  * If you are getting gas limit errors this may be because you forgot to approve the contract as operator of asset
  * 
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {ManagerId} walletManagerId - The Asset-Pair to Energize the Token with
  * @param {string} assetToken - The Address of the Asset Token being used
  * @param {BigNumberish} assetAmount - The Amount of Asset Token to Energize the Token with
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to
  * @param {string} [referrer]
  * @return {Promise<ContractReceipt>} A contract receipt from the transaction.
  * 
  * {@link https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedParticles.sol#L267 Solidity Contract Method}
  */
  public async energize(
    walletManagerId: ManagerId,
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

  /**
  * Allows the owner or operator of the token to collect or transfer the interest generated from the token
  * without removing the underlying asset that is held within the token.
  * 
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {string} receiver - The address to receive the discharged asset tokens.
  * @param {ManagerId} walletManagerId - The wallet manager of that assets to discharge from the token.
  * @param {string} assetToken - The address of the asset token being discharged.
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to.j
  * @return {Promise<ContractReceipt>}  A receipt from the contract transaction.
  */
  public async discharge(
    receiver: string,
    walletManagerId: ManagerId,
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

  /**
  * Allows the owner or operator of the Token to collect or transfer a specific amount of the interest
  * generated from the token without removing the underlying Asset that is held within the token.
  * 
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {string} receiver - The address to receive the discharged asset tokens.
  * @param {ManagerId} walletManagerId - The wallet manager of the assets to discharge from the token.
  * @param {string} assetToken - The address of the asset token being discharged.
  * @param {BigNumberish} assetAmount - The specific amount of asset token to discharge from the particle.
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to.
  * @return {Promise<ContractReceipt>} A receipt from the transaction.
  */
  public async dischargeAmount(
    receiver: string,
    walletManagerId: ManagerId,
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

  /**
  * Allows the Creator of the Token to collect or transfer a their portion of the interest (if any)
  * generated from the token without removing the underlying Asset that is held within the token.
  * 
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {string} receiver - The address to receive the discharged asset tokens
  * @param {ManagerId} walletManagerId - The wallet manager of the assets to discharge from the token
  * @param {string} assetToken - The address of the asset token being discharged
  * @param {BigNumberish} assetAmount - The specific amount of asset token to discharge from the particle
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to
  * @return {Promise<ContractReceipt>}  A receipt from the transaction
  */
  public async dischargeForCreator(
    receiver: string,
    walletManagerId: ManagerId,
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

  /**
  * Releases the full amount of asset + interest held within the particle by LP of the assets.
  * 
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {string} receiver - The address to receive the released asset tokens.
  * @param {ManagerId} walletManagerId - The wallet manager of the assets to release from the token.
  * @param {string} assetToken - The address of the asset token being released.
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to.
  * @return {Promise<ContractReceipt>} A receipt from the transaction.
  */
  public async release(
    receiver: string,
    walletManagerId: ManagerId,
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

  /**
  * Releases a partial amount of asset + interest held within the particle by LP of the assets.
  * 
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {string} receiver - The address to receive the released asset tokens
  * @param {ManagerId} walletManagerId - The wallet manager of the assets to release from the token
  * @param {string} assetToken - The address of the asset token being released
  * @param {BigNumberish} assetAmount - The specific amount of asset token to release from the particle
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to
  * @return {Promise<ContractReceipt>}  A receipt from the transaction
  */
  public async releaseAmount(
    receiver: string,
    walletManagerId: ManagerId,
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

  /**
  * Deposit other NFT assets into the particle.
  * Must be called by the account providing the asset. Account must approve THIS contract as operator of asset.
  * 
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {string} basketManagerId - The basket to deposit the NFT into.
  * @param {string} nftTokenAddress - The address of the NFT token being deposited.
  * @param {string} nftTokenId - The ID of the NFT token being deposited.
  * @param {BigNumberish} nftTokenAmount - The amount of tokens to deposit (ERC1155-specific).
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to.
  * @return {Promise<ContractReceipt>} A receipt from the transaction.
  */
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

  /**
  * Release NFT assets from the particle.
  * 
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {string} receiver - The address to receive the released asset tokens.
  * @param {string} basketManagerId - The basket to release the NFT from.
  * @param {string} nftTokenAddress - The address of the NFT token being released.
  * @param {string} nftTokenId - The ID of the NFT token being released.
  * @param {BigNumberish} nftTokenAmount - The amount of tokens to deposit (ERC1155-specific).
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to.
  * @return {Promise<ContractReceipt>} A receipt from the transaction.
  */
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

  /**
  * Sets a timelock on the ability to release the assets of a particle.
  *
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {number} unlockBlock - The Ethereum block number to timelock until (~15 seconds per block).
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to.
  * @return {Promise<ContractReceipt>} - A receipt from the transaction.
  */
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

  /**
  * Sets a timelock on the ability to discharge the assets of a particle
  *
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {number} unlockBlock - The Ethereum block number to timelock until (~15 seconds per block).
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to.
  * @return {Promise<ContractReceipt>} A receipt from the transaction.
  */
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

  /**
  * Sets a timelock on the ability to break the covalent bond of a particle
  *
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {number} unlockBlock - The Ethereum block number to timelock until (~15 seconds per block).
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to.
  * @return {Promise<ContractReceipt>} A receipt from the transaction.
  */
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

  /**
  * Sets the custom configuration for creators of proton-based NFTs
  * Must be called by account that created and owns the particle
  * 
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {string} creator - The creator's address of the proton-based NFT.
  * @param {BigNumberish} annuityPercent - The percentage of interest-annuities to reserve for the creator. In decimal this can range from 0 - 10000. 5712 would be 57.12%..
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to.
  * @return {Promise<ContractReceipt>} A receipt from the transaction.
  */
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

  /**
  * Sets a custom receiver address for the creator annuities
  * Must be called by account that created and owns the particle
  * 
  * @memberof NFT
  * @instance
  * @async
  * 
  * @param {string} receiver - The receiver of the creator interest annuities.
  * @param {number} [chainId] - Optional parameter that allows for the user to specify which network to write to.
  * @return {Promise<ContractReceipt>} - A receipt from the transaction.
  */
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