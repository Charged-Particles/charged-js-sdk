import { ChargedState, AddressByChain } from '../../types';
import { getAddress } from '../../utils/contractUtilities';
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
  * Get the address of any Charged PArticles Protocol contract.
  *
  * @memberof Utilities
  *
  * @return {AddressByChain} contract addresses listed by Chain ID
  */
 public async getContractAddress(contractName: string, networks: (number)[] = []): Promise<AddressByChain> {
  const { providers } = this.state;
  const chainIds: (number)[] = networks;
  if (chainIds.length === 0) {
    for (let network in providers) {
      if (network === 'external') {
        const { chainId } = await providers['external'].getNetwork();
        network = chainId;
      }
      chainIds.push(Number(network));
    }
  }

  const addresses: AddressByChain = {};
  for (let i = 0; i < chainIds.length; i++) {
    addresses[chainIds[i]] = getAddress(Number(chainIds[i]), contractName);
  }
  return addresses;
}

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
