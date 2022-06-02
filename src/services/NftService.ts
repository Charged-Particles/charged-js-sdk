import { BigNumberish, ethers } from 'ethers';
import { Configuration } from '../types';
import { getAbi } from '../utils/initContract';
import { SUPPORTED_NETWORKS } from '../utils/getAddressFromNetwork';

import BaseService from './baseService';
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
  
  public async getChainIdsForBridgedNFTs() {
    const { providers } = this.config;

    const rawData: object[] = [];
    // const bridgedData: object[] = [];

    try {
      for await (const network of SUPPORTED_NETWORKS) {
        let chainId = String(network.chainId);

        let provider = providers[chainId];

        if(provider == undefined) {
          const network = ethers.providers.getNetwork(chainId);
          if (Boolean(network?._defaultProvider)) {
            provider = ethers.getDefaultProvider(network);
          } else {
            continue;
          }
        }

        let contractExists = await provider.getCode(this.contractAddress);
        // console.log({contractExists});
        if (contractExists !== '0x') {                                                // contract exists on respective network
          let contract = new ethers.Contract(
            this.contractAddress,
            getAbi('protonB'),
            provider
            );

            const singer = this.getSigner();
            const signerAddress = await singer?.getAddress();

            const owner = await contract.ownerOf(this.tokenId);

            console.log({owner, signerAddress})
            if (signerAddress == owner) {
              rawData.push({'chainId': Number(chainId)});
            }
          }
        }
    } catch (error) {
      console.log(error);
      // throw error;
    }

    // if we find it is on multiple chains, then we have to find the owner of nft and store it for each chain
    // when we go to write check if the owner matches the signer
    return rawData;
  }

  public async energizeParticle(
    walletManagerId:String, 
    assetToken:String,
    assetAmount:BigNumberish
  ) {
    const contract = this.getContractInstance('chargedParticles', this.network);
    const result = await contract.energizeParticle(this.contractAddress, this.tokenId, walletManagerId, assetToken, assetAmount, '0xfd424d0e0cd49d6ad8f08893ce0d53f8eaeb4213');
    return result;
  }

  public async tokenURI() {
    const tokenURI = await this.callContract('protonB', 'tokenURI', this.network, [this.tokenId]);
    return tokenURI;
  }

}

