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

  public async getNetworkIdFromContractAddress(contractAddress: string) {
    const { providers } = this.config;

    const foundNetworks: number[] = []
    for await (const network of Object.keys(providers)) {
      const code = await providers[network].getCode(contractAddress);
      if (code !== '0x') {                                                // contract exists on each network
        foundNetworks.push(Number(network));
      }
    }

    if (foundNetworks.length !== 1) {
      throw new Error('Identical contract address exists on 2 or more networks, please use a different contractAddress')
    }
  
    return foundNetworks[0];
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
}
