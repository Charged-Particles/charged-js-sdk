import { BigNumberish, ethers,Contract } from 'ethers';
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

  // Overrides parent method: uses contract address to set instance.
  public getContractInstance(contractName:string, network: number): Contract{
    const { providers, externalProvider, signer } = this.config;

    const provider = providers[network] ?? externalProvider;

    if (!this.contractInstances[this.contractAddress]) {
      let requestedContract = new ethers.Contract(
        this.contractAddress,
        getAbi('erc721'),
        provider
      );
        
      if(signer && provider && contractName) {
        const connectedWallet = signer.connect(provider);
        requestedContract = requestedContract.connect(connectedWallet);
      }

      this.contractInstances[this.contractAddress] = requestedContract;
    }
    return this.contractInstances[this.contractAddress];
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

        if (contractExists !== '0x') {                                                // contract exists on respective network

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

    if (tokenChainIds.includes(signerNetwork)) { return true };

    throw new Error(`Signer network: ${signerNetwork}, does not match any token chain ids.`)
  }

  public async energizeParticle(
    walletManagerId:String, 
    assetToken:String,
    assetAmount:BigNumberish,
    chainId?: number
  ) {
    const signerNetwork = await this.getSignerConnectedNetwork(chainId);

    await this.bridgeNFTCheck(signerNetwork);

    const params = [
      this.contractAddress,
      this.tokenId, walletManagerId, 
      assetToken, 
      assetAmount, 
      '0xfd424d0e0cd49d6ad8f08893ce0d53f8eaeb4213'
    ];

    return await this.callContract('chargedParticles', 'energizeParticle', signerNetwork, params);
  }

  public async tokenURI() {
    return await this.fetchAllNetworks('erc721', 'tokenURI', [this.tokenId]);
  }
}