import { Contract, ethers } from 'ethers';
import { Configuration } from '../types';
import { getAddressFromNetwork } from '../utils/getAddressFromNetwork';
import { isValidContractName, getAbi, getAddressByNetwork } from '../utils/initContract';

export default class BaseService {
  readonly contractInstances: { [address: string]: Contract };

  readonly config: Configuration;

  constructor(config: Configuration) {
    this.config = config;
    this.contractInstances = {};
  }

  public getContractInstance(contractName:string, network: number): Contract{
    const { providers, signer } = this.config;

    const provider = providers[network];
    const networkFormatted:string = getAddressFromNetwork(network);
    // check if safe contract name was given
    isValidContractName(contractName);
    
    const address = getAddressByNetwork(networkFormatted, contractName)

    if (!this.contractInstances[address]) {
      let requestedContract = new ethers.Contract(
        address,
        getAbi(contractName),
        provider
      );
        
      if(signer && provider) {
        const connectedWallet = signer.connect(provider);
        requestedContract = requestedContract.connect(connectedWallet);
      }

      this.contractInstances[address] = requestedContract;
    }

    return this.contractInstances[address];
  }

  public async fetchAllNetworks(contractName: string, methodName: string, params: any[] = []) {
    const { providers } = this.config;

    try {
      let transactions = [];
      let networks:number[] = [];

      for (const network in providers) {
        transactions.push(this.callContract(contractName, methodName, Number(network), params));
        networks.push(Number(network));
      } 

      const responses = await Promise.all(transactions);
      const formattedResponse: {[number: number]: any} = {};

      responses.forEach((response, index) => {
        formattedResponse[networks[index]] = response;
      });

      return formattedResponse; 
    } catch(error) {
      console.log('fetchAllNetworks error >>>> ', error);
      return [];
    }
  }

  public async callContract(
    contractName: string, 
    methodName: string, 
    network: number,
    params: any[] = []
  ) {

    try {
      const requestedContract = this.getContractInstance(contractName, network);
      return requestedContract[methodName](...params);

    } catch(e) {

      console.log('fetchQuery error:', e);
      return {};
    }
  }

  public async storeTokenIdsAcrossChains(contractAddress: string, tokenId: number) {
    const { providers } = this.config;

    const data: object[] = [];

    try {
      for await (const network of Object.keys(providers)) {
        const contractExist  = await providers[network].getCode(contractAddress);
        
        if (contractExist !== '0x') {                                                // contract exists on respective network

          let contract = new ethers.Contract(
            contractAddress,
            getAbi('protonB'),
            providers[network]
          );

          const owner = await contract.ownerOf(tokenId);
          data.push({'tokenId': tokenId, 'chainId': Number(network), 'ownerOf': owner});
        }
      }
    } catch (error) {
      throw error;
    }

    // if we find it is on multiple chains, then we have to find the owner of nft and store it for each chain
    // when we go to write check if the owner matches the signer

    return data;
  }
}
