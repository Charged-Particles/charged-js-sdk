import { Contract, ethers } from 'ethers';
import { Configuration } from '../types';
import { getAbi, getAddressByNetwork } from '../utils/initContract';
export default class BaseService {
  readonly contractInstances: { [address: string]: Contract };

  readonly config: Configuration;

  constructor(config: Configuration) {
    this.config = config;
    this.contractInstances = {};
  }

  public getContractInstance(
    contractName: string,
    network: number,
    contractAddress?: string
  ): Contract {
    const { providers, signer } = this.config;

    const provider = providers[network] ?? providers[0];
    const address = contractAddress ?? getAddressByNetwork(network, contractName);

    if (!this.contractInstances[address]) {
      let requestedContract = new ethers.Contract(
        address,
        getAbi(contractName),
        provider
      );

      if (signer && provider) {
        const connectedWallet = signer.connect(provider);
        requestedContract = requestedContract.connect(connectedWallet);
      }

      this.contractInstances[address] = requestedContract;
    }

    return this.contractInstances[address];
  }

  public async fetchAllNetworks(
    contractName: string,
    methodName: string,
    params: any[] = [],
    contractAddress?: string
  ) {
    const { providers } = this.config;

    let transactions = [];
    let networks: (number)[] = [];

    for (let network in providers) {

      if (network === '0') {
        const { chainId } = await providers[0].getNetwork()
        network = chainId;
      }

      networks.push(Number(network));

      transactions.push(
        this.callContract(
          contractName,
          methodName,
          Number(network),
          params,
          contractAddress
        )
      );
    }

    const responses = await Promise.allSettled(transactions);
    const formattedResponse: { [number: number]: { value: any, status: string } } = {};

    responses.forEach((response, index) => {
      if (response.status === "fulfilled") {
        formattedResponse[networks[index]] = { value: response.value, status: 'fulfilled' };
      } else {
        formattedResponse[networks[index]] = { value: response.reason, status: 'rejected' };
      }
    });

    return formattedResponse;
  }

  public async callContract(
    contractName: string,
    methodName: string,
    network: number,
    params: any[] = [],
    contractAddress?: string
  ) {
    const requestedContract = this.getContractInstance(contractName, network, contractAddress);
    return requestedContract[methodName](...params);
  }

  public async getNetworkFromProvider(): Promise<number[]> {
    // TODO: update for single provider
    const { providers } = this.config;

    let networks: number[] = [];

    if (Object.keys(providers).length !== 0) {
      for (const network in providers) {
        networks.push(Number(network));
      }
    }

    return networks;
  }

  public async getSignerAddress() {
    const { signer } = this.config;

    if (signer) { return signer?.getAddress(); };

    throw new Error('No signer provided');
  }

  public async getSignerConnectedNetwork(network?: number): Promise<number> {
    const { providers } = this.config;

    const chainIds = Object.keys(providers);
    const chainIdsLength = chainIds.length;

    if (chainIdsLength) {

      if (chainIdsLength > 1 && network) {
        return network; // specify network intent when more than one provider.

      } else if(chainIdsLength == 1) {
        const chainIdFromSingleProvider = Number(chainIds[0]); // return the network of the single provider

        if (chainIdFromSingleProvider == 0) { 
          const externalProviderNetwork = await providers[0].getNetwork() 
          return externalProviderNetwork.chainId;
        } 
        else { return chainIdFromSingleProvider };

      } else {
        throw new Error('Please specify the targeted network');
      }
    } else {
      throw new Error(`Could not fetch network: from supplied providers`);
    }
  }
}