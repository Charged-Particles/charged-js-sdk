import { Contract, ethers} from 'ethers';
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
    const { providers, externalProvider, signer } = this.config;

    const provider = providers[network] ?? externalProvider;

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
    const { providers, externalProvider } = this.config;

    try {
      let transactions = [];

      const networks = await this.getNetworkFromProvider();

      if (Object.keys(providers).length !== 0) {
        for (const network in providers) {
          transactions.push(this.callContract(contractName, methodName, Number(network), params));
        } 
      } else if(Boolean(externalProvider)) {
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
    const { providers, externalProvider } = this.config;

    let networks:number[] = [];

    if (Object.keys(providers).length !== 0) {
      for (const network in providers) {
        networks.push(Number(network));
      } 
    } else if (Boolean(externalProvider)) {
      const currentNetwork = await externalProvider?.getNetwork();

      // TODO: throw if no network found
      networks.push(Number(currentNetwork?.chainId));
    }
  
    return networks;
  }

  public async getSignerAddress() {
    const { signer, web3Provider } = this.config;

    if (signer) { return signer?.getAddress(); };

    if (web3Provider) {
      //@ts-ignore 
      const accounts = await web3Provider.request({ method: 'eth_accounts' });
      return accounts[0];
    };
  }

  public async getSignerConnectedNetwork(network?: number): Promise<number> {
    const { providers, externalProvider } = this.config;

    const chainIds = Object.keys(providers);

    if (chainIds.length !== 0) {
      if (chainIds.length > 1 && network) {
        return network;
      } else {
        return Number(chainIds[0]);
      }
    } else if (externalProvider) {
      const externalProviderNetwork = await externalProvider.getNetwork();
      return externalProviderNetwork.chainId;
    } else {
      throw new Error(`Could not fetch network: ${network} from supplied providers`);
    }
  }
}
