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
    return await this.fetchAllNetworks('chargedParticles', 'getStateAddress');
  }

}
