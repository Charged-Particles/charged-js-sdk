import BaseService from './baseService';
import {
  ChargedState,
} from '../../types';

/** 
* @name ERC20
* @class ERC20
*
* Returns a wrapped erc20 class.
* @param {string} contractAddress
* @return {Erc20Service}  Instance of a erc20 token standard
* 
*/
export default class Erc20Service extends BaseService {
  public contractAddress: string;

  constructor(
    state: ChargedState,
    contractAddress: string,
  ) {
    super(state);
    this.contractAddress = contractAddress;
  }

  /**
 * Returns your account's balance of a given ERC20 token.
 *
 * @param {string} account
 * @returns {number} The user account's token balance, in base units (eg. 1000000000000000000 wei)
 *
 */

  public async balanceOf(account: string) {
    const parameters = [
      account
    ];

    return await this.fetchAllNetworks(
      'ionx',
      'balanceOf',
      parameters,
      this.contractAddress,
    );
  };
}