import { Configuration } from '../types';
import BaseService from './baseService';

export default class ChargedParticlesService
  extends BaseService {
  readonly tokenDecimals: { [address: string]: number };

  constructor(config: Configuration) {
    super(config);
    this.tokenDecimals = {};
  }

  /// @notice returns the state adress from the ChargedParticles contract
  /// @param provider - optional parameter. if not defined the code will use the ethers default provider.
  /// @returns string of state address
  public async getStateAddress() {
    const chargedParticlesContract = this.getContractInstance('chargedParticles');

    const stateAddress:String = await chargedParticlesContract.getStateAddress();
    return stateAddress;
  }

}
