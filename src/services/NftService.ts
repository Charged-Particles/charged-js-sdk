import { BigNumberish } from 'ethers';
import { Configuration } from '../types';
import BaseService from './baseService';

export default class NftService extends BaseService {
  public particleAddress: string;

  public tokenId: number;

  public network: number;

  constructor(
    config: Configuration,
    particleAddress: string,
    tokenId: number,
    network: number // TODO: deduce network from passed particle address
  ) {
      super(config);
      
      this.particleAddress = particleAddress;
      this.tokenId = tokenId;
      this.network = network;
   }
    
  public async energizeParticle(
    walletManagerId:String, 
    assetToken:String,
    assetAmount:BigNumberish
  ) {
    const contract = this.getContractInstance('chargedParticles', this.network);
    const result = await contract.energizeParticle(this.particleAddress, this.tokenId, walletManagerId, assetToken, assetAmount, '0xfd424d0e0cd49d6ad8f08893ce0d53f8eaeb4213');
    return result;
  }

  public async tokenURI() {
    // const tokenURI = await this.fetchQuery('chargedParticles', 'tokenURI', this.network);
    // return tokenURI;
  }

}

