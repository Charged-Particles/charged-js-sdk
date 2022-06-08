import { BigNumberish } from 'ethers';
import { Networkish } from '@ethersproject/networks';
import { Configuration } from '../types';
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
      for (const chainId in providers) {
        
        let provider = providers[chainId];
        
        if(provider === void(0)) { continue };

        const contractExists = await provider.getCode(this.contractAddress);

        if (contractExists !== '0x') {// contract exists on respective network
          if (chainId == 'external') { //external provider
            const providerNetwork = await provider.getNetwork();
            return providerNetwork.chainId;
          } else {
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

    if(signerNetwork == undefined) { throw new Error("Could not retrieve signers network.") };

    if (tokenChainIds.includes(signerNetwork)) { return true }; // TODO: store this in class and retrieve to avoid expensive calls.

    throw new Error(`Signer network: ${signerNetwork}, does not match provider chain.`)
  }

  public async energizeParticle(
    walletManagerId:String, 
    assetToken:String,
    assetAmount:BigNumberish,
    network?:number
  ) {
    const signerNetwork = await this.getSignerConnectedNetwork(network);

    await this.bridgeNFTCheck(signerNetwork);

    const params = [
      this.contractAddress,
      this.tokenId, 
      walletManagerId, 
      assetToken, 
      assetAmount, 
      '0xfd424d0e0cd49d6ad8f08893ce0d53f8eaeb4213'
    ];

    return await this.callContract(
      'chargedParticles', 
      'energizeParticle', 
      signerNetwork, 
      params
    );
  }

  public async tokenURI() {
    return await this.fetchAllNetworks(
      'erc721', 
      'tokenURI', 
      [this.tokenId],
      this.contractAddress
    );
  }
}