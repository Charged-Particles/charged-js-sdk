import { ChargedState } from '../../types';
import BaseService from './baseService';

export default class UtilsService extends BaseService {

  constructor(state: ChargedState) {
    super(state);
  }

  /// TODO: IMPLEMENT
  // public async supportsInterface() {

  // }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ChargedParticles utility functions
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /// @notice returns the state adress from the ChargedParticles contract
  /// @returns string of state address
  public async getStateAddress() {
    return await this.fetchAllNetworks('chargedParticles', 'getStateAddress');
  }

  /// @notice returns the settings adress from the ChargedParticles contract
  /// @returns string of settings address
  public async getSettingsAddress() {
    return await this.fetchAllNetworks('chargedParticles', 'getSettingsAddress');
  }

  /// @notice returns the managers adress from the ChargedParticles contract
  /// @returns string of settings address
  public async getManagersAddress() {
    return await this.fetchAllNetworks('chargedParticles', 'getManagersAddress');
  }

  /// @notice returns the deposit fee of the protocol
  /// @returns protocol fee
  public async getFeesForDeposit() {
    return await this.fetchAllNetworks('chargedParticles', 'getFeesForDeposit');
  }
}
