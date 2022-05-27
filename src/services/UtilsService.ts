import { BigNumberish } from 'ethers';
import { Configuration } from '../types';
import BaseService from './baseService';

export default class UtilsService extends BaseService {

  constructor(config: Configuration) {
    super(config);
  }

  /// @notice returns the state adress from the ChargedParticles contract
  /// @param provider - optional parameter. if not defined the code will use the ethers default provider.
  /// @returns string of state address
  public async getStateAddress() {
    // const chargedParticlesContract = this.getContractInstance('chargedParticles');
    // const stateAddress:String = await chargedParticlesContract.getStateAddress();
    // return stateAddress;
    return await this.fetchQuery('chargedParticles', 'getStateAddress', 1);
  }

  public async getAllStateAddresses() {
    return await this.fetchQuery('chargedParticles', 'getStateAddress', 42);
  }

  public async energizeParticle(contractAddress:String, tokenId:BigNumberish, walletManagerId:String, assetToken:String, assetAmount:BigNumberish) {
    const contract = this.getContractInstance('chargedParticles', 1);
    const result = await contract.energizeParticle(contractAddress, tokenId, walletManagerId, assetToken, assetAmount, '0xfd424d0e0cd49d6ad8f08893ce0d53f8eaeb4213');
    return result;
  }

}
