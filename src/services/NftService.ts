import { BigNumberish, ethers } from 'ethers';
import { Networkish } from '@ethersproject/networks';
import { Configuration } from '../types';
import { getAbi } from '../utils/initContract';
import { SUPPORTED_NETWORKS } from '../utils/getAddressFromNetwork';
import BaseService from './baseService';

export default class NftService extends BaseService {

  public contractAddress: string;
  public tokenId: number;
  public chainIds: [number];

  constructor(
    config: Configuration,
    contractAddress: string,
    tokenId: number,
  ) {
    super(config);
    this.contractAddress = contractAddress;
    this.tokenId = tokenId;

    (async () => {
      this.chainIds = await this.findContractChains();
    })();
  }

  public async findContractChains() {
    const { providers } = this.config;

    const tokenChainIds: Networkish[] = [];
    for await (const network of providers) {
      let chainId = network.chainId;
      let provider = providers[chainId];
      const contractExists = await provider.getCode(this.contractAddress);
      if (contractExists !== '0x') {// contract exists on respective network
        tokenChainIds.push(chainId);
      }
    }
    return tokenChainIds;
  }

  public async isSignerOnContractChain(signerNetwork: Networkish) {
    return this.chainIds.includes(signerNetwork);
  }

  public async energizeParticle(
    walletManagerId:String,
    assetToken:String,
    assetAmount:BigNumberish,
  ) {
    // const signerNetwork = await this.getSignerConnectedNetwork();
    const signerNetwork = await this.config.signer?.getChainId();
    if (!await this.isSignerOnContractChain(signerNetwork)) {
      throw new Error(`Signer network: ${signerNetwork}, does not match provider chain.`)
    }

    const params = [
      this.contractAddress,
      this.tokenId,
      walletManagerId,
      assetToken,
      assetAmount,
      '0xfd424d0e0cd49d6ad8f08893ce0d53f8eaeb4213'
    ];

    return await this.writeContract(
      'chargedParticles',
      'energizeParticle',
      params
    );
  }

  public async tokenURI() {
    return await this.fetchAllNetworks(
      'erc721',
      'tokenURI',
      [this.tokenId],
      this.contractAddress
    );
  }
}