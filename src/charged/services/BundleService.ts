import { ChargedState } from "../../types";
import BaseService from "./baseService";
import {
  ManagerId
} from "../../types";
import { ContractCallResults } from "ethereum-multicall";

export interface Token {
  type: 'erc20' | 'nft';
  receiver: string;
  walletManagerId: ManagerId;
  assetAddress: string;
  assetTokenId?: string; // Only required for nft release
  assetTokenAmount?: string; // Only required for nft release
}

/**
 * @name Bundle
 * @class Bundle
 * 
 * Returns a predefined group of tokens to act on
 * @param {Token} tokens
 * @return {BundleService} List of tokens ready to act on with a multicall
 * 
 * @example
 * 
 */
export default class BundleService extends BaseService {
  public contractAddress: string;
  public tokenId: string;
  public tokens: Token[];
  public chainId: number;

  constructor(
    state: ChargedState,
    contractAddress: string,
    tokenId: string,
    tokens: Token[],
    chainId: number,
  ) {
    super(state);
    this.contractAddress = contractAddress;
    this.tokenId = tokenId;
    this.tokens = tokens;
    this.chainId = chainId;
  };

  public async multiRelease(): Promise<ContractCallResults> {
    const calls = this.tokens.map(token => {
      if (token.type === 'erc20') {
        return {
          reference: `releaseParticle-${token.assetAddress}`,
          methodName: 'releaseParticle',
          methodParameters: [ token.receiver, this.contractAddress, this.tokenId, token.walletManagerId, token.assetAddress ],
        }
      } else {
        return {
          reference: `breakCovalentBond-${token.assetAddress}-${token.assetTokenId}-${token.assetTokenAmount}}`,
          methodName: 'breakCovalentBond',
          methodParameters: [ token.receiver, this.contractAddress, this.tokenId, token.walletManagerId, token.assetAddress, token.assetTokenId, token.assetTokenAmount ],
        };
      }
    })

    return await this.multiWriteContract(this.chainId, calls);
  };
};