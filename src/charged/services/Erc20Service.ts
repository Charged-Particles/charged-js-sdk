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


}