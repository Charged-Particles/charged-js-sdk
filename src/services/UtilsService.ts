import { Configuration } from '../types';
import BaseService from './baseService';

export default class UtilsService extends BaseService {

  constructor(config: Configuration) {
    super(config);
  }

  /// TODO: IMPLEMENT
  // public async supportsInterface() {

  // }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ChargedParticles utility functions
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /// @notice returns the state adress from the ChargedParticles contract
  /// @returns string of state address
  public async getStateAddress(): Promise<MultiNetworkResponse> {
    return await this.fetchAllNetworks('chargedParticles', 'getStateAddress');
  }

  /// @notice returns the settings adress from the ChargedParticles contract
  /// @returns string of settings address
  public async getSettingsAddress(): Promise<MultiNetworkResponse> {
    return await this.fetchAllNetworks('chargedParticles', 'getSettingsAddress');
  }

  /// @notice returns the managers adress from the ChargedParticles contract
  /// @returns string of settings address
  public async getManagersAddress(): Promise<MultiNetworkResponse> {
    return await this.fetchAllNetworks('chargedParticles', 'getManagersAddress');
  }

  /// @notice returns the deposit fee of the protocol
  /// @returns protocol fee
  public async getFeesForDeposit(): Promise<MultiNetworkResponse> {
    return await this.fetchAllNetworks('chargedParticles', 'getFeesForDeposit');
  }
}

type MultiNetworkResponse = {
  [network: string]: string
}
