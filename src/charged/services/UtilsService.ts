import { ChargedState } from '../../types';
import BaseService from './baseService';

/** 
* @class UtilsService
* 
* Returns an object with a  set of charged particles utilities methods
* @return {UtilsService} 
* @memberof Charged 
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
 *  Get the state address from the ChargedParticles contract.
 * @memberof UtilsService
 * @return {string} state contract address
 */
  public async getStateAddress() {
    return await this.fetchAllNetworks('chargedParticles', 'getStateAddress');
  }

/**
 *  Get settings address from the ChargedParticles contract.
 *
 * @return {string} settings contract address
 */
  public async getSettingsAddress() {
    return await this.fetchAllNetworks('chargedParticles', 'getSettingsAddress');
  }

/**
 *  Get managers address from the Settings contract
 *
 * @return {string} manager contract address
 */
  public async getManagersAddress() {
    return await this.fetchAllNetworks('chargedParticles', 'getManagersAddress');
  }

/**
 *  Get the deposit fee of the protocol.
 *
 * @return {string} fee amount. 
 */
  public async getFeesForDeposit() {
    return await this.fetchAllNetworks('chargedParticles', 'getFeesForDeposit');
  }
}
