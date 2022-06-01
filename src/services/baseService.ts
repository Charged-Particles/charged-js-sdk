import { Contract, ethers } from 'ethers';
import { Configuration } from '../types';
import { getAddressFromNetwork } from '../utils/getAddressFromNetwork';
import { checkContractName, getAbi, getAddressByNetwork } from '../utils/initContract';

export default class BaseService {
  readonly contractInstances: { [address: string]: Contract };

  readonly config: Configuration;

  constructor(config: Configuration) {
    this.config = config;
    this.contractInstances = {};
  }

  public getContractInstance(contractName:string, network: number): Contract{
    const { providers, injectedProvider, signer } = this.config;

    const provider = providers[network] ?? injectedProvider;

    const networkFormatted:string = getAddressFromNetwork(network);
   
    // check if safe contract name was given
    checkContractName(contractName);
    
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
    const { providers, injectedProvider } = this.config;

    try {
      let transactions = [];

      const networks = await this.getNetworkFromProvider();

      if (Object.keys(providers).length !== 0) {
        for (const network in providers) {
          transactions.push(this.callContract(contractName, methodName, Number(network), params));
        } 
      } else if(Boolean(injectedProvider)) {
        transactions.push(this.callContract(contractName, methodName, Number(networks[0]), params));
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

  public async getNetworkFromProvider(): Promise<number[]> {
    const { providers, injectedProvider } = this.config;

    let networks:number[] = [];

    if (Object.keys(providers).length !== 0) {
      for (const network in providers) {
        networks.push(Number(network));
      } 
    } else if (Boolean(injectedProvider)) {
      const currentNetwork = await injectedProvider?.getNetwork();

      // TODO: throw if no network found
      networks.push(Number(currentNetwork?.chainId));
    }
  
    return networks;
  }
}
