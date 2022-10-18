import { BigNumberish } from 'ethers';
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
 * @param {string} account - Address
 * @returns {BigNumber}
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

  /**
 * Get your account's allowance of a given ERC20 token.
 *
 * @param {string} account - Address
 * @returns {BigNumber} 
 *
 */
  public async allowance(owner: string, spender: string) {
    const parameters = [
      owner,
      spender,
    ];

    return await this.fetchAllNetworks(
      'ionx',
      'allowance',
      parameters,
      this.contractAddress,
    );
  };

  /**
 *   
 *
 * @param {string} account - Address
 * @param {BigNumberish} amount 
 * @param {number} [chainId] 
 * @returns {Promise<ContractTransaction>}
 *
 */
  public async approve(
    account: string,
    amount: BigNumberish,
    chainId?: number
  ) {
    const signerNetwork = await this.getSignerConnectedNetwork(chainId);
    const parameters = [
      account,
      amount,
    ];

    return await this.writeContract(
      'ionx',
      'approve',
      signerNetwork,
      parameters,
      this.contractAddress,
    );
  };

}