import { ChargedState } from '../../types';
import BaseService from './baseService';

/** 
* @name Utilities
* @class UtilsService
* 
* Returns an object with a  set of charged particles utilities methods
* @return {UtilsService} 
* @example
* const charged = new Charged({providers: window.ethereum});
* const creatorAnnuities = await charged.utils.getStateAddress();
*/
export default class UtilsService extends BaseService {

  constructor(state: ChargedState) {
    super(state);
  }

 //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 // ChargedParticles utility functions
 //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 /**
 * Get the address of the chargedState contract.
 * 
 * @memberof Utilities
 * 
 * @return {string} state contract address
 */
  public async getStateAddress() {
    return await this.fetchAllNetworks('chargedParticles', 'getStateAddress');
  }

/**
 * Get the address of the chargedSettings contract.
 *
 * @memberof Utilities
 * 
 * @return {string} settings contract address
 */
  public async getSettingsAddress() {
    return await this.fetchAllNetworks('chargedParticles', 'getSettingsAddress');
  }

/**
 * Get the address of the chargedManagers contract.
 *
 * @memberof Utilities
 * 
 * @return {string} manager contract address
 */
  public async getManagersAddress() {
    return await this.fetchAllNetworks('chargedParticles', 'getManagersAddress');
  }

/**
 * Get the deposit fee of the protocol.
 *
 * @memberof Utilities
 * 
 * @return {string} protocol fee amount. 
 */
  public async getFeesForDeposit() {
    return await this.fetchAllNetworks('chargedParticles', 'getFeesForDeposit');
  }
}
