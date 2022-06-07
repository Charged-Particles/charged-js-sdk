import { Contract, ethers} from 'ethers';
import { Configuration } from '../types';
import { getAbi, getAddressByNetwork } from '../utils/initContract';
export default class BaseService {
  readonly contractInstances: { [address: string]: Contract };
  readonly contractInstancesWrite: { [address: string]: Contract };

  readonly config: Configuration;

  constructor(config: Configuration) {
    this.config = config;
    this.contractInstances = {};
  }

  public getContractInstance(
    contractName:string,
    network: number,
    contractAddress?: string
  ): Contract {
    const { providers, externalProvider, signer } = this.config;

    const provider = providers[network] ?? externalProvider;
    const address = contractAddress ?? getAddressByNetwork(network, contractName);

    if (!this.contractInstances[address]) {
      let requestedContract = new ethers.Contract(
        address,
        getAbi(contractName),
        provider
      );

      // Read Provider
      this.contractInstances[address] = requestedContract;

      // Write Provider
      if (signer) {
        // const connectedWallet = signer.connect(provider);
        // requestedContract = requestedContract.connect(connectedWallet);
        this.contractInstancesWrite[address] = requestedContract.connect(signer);
      }

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

    // const key = ethers.utils.sha256(JSON.stringify(cacheKey));


    let transactions = [];

    for (const network in providers) {
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
    const formattedResponse: {[number: number]: {value: any, status: string}} = {};

    responses.forEach((response, index) => {
      if (response.status === "fulfilled") {
        formattedResponse[networks[index]] =  {value: response.value, status: 'fulfilled'};
      } else {
        formattedResponse[networks[index]] =  {value: response.reason, status: 'rejected'};
      }
    });

    return formattedResponse;
  }

  public async readContract(
    contractName: string,
    methodName: string,
    network: number,
    params: any[] = [],
    contractAddress?: string
  ) {
    const requestedContract = this.getContractInstance(contractName, network, contractAddress);
    return requestedContract.callStatic[methodName](...params);
  }
  public async writeContract(
    contractName: string,
    methodName: string,
    params: any[] = [],
    contractAddress?: string
  ) {
    const requestedContract = this.getContractInstance(contractName, network, contractAddress);
    return requestedContract.callStatic[methodName](...params);
  }

  public async getNetworkFromProvider(provider): Promise<number[]> {

    return await provider?.getNetwork();;
  }

  public async getSignerAddress() {
    const { signer, web3Provider } = this.config;

    if (signer) { return await signer?.getAddress(); };

    throw new Error('No signer provided');
  }

  public async getSignerConnectedNetwork(network?: number): Promise<number> {
    const { providers, externalProvider } = this.config;

    const chainIds = Object.keys(providers);
    const chainIdsLength = chainIds.length;

    if (chainIdsLength) {

      if (chainIdsLength > 1 && network) {
        return network; // specify network intent when more than one provider.

      } else if(chainIdsLength == 1) {
        return Number(chainIds[0]); // return the network of the single provider

      } else {
        throw new Error('Please specify the targeted network');
      }
    } else if (externalProvider) {
      const externalProviderNetwork = await externalProvider.getNetwork();
      return externalProviderNetwork.chainId;

    } else {
      throw new Error(`Could not fetch network: ${network} from supplied providers`);
    }
  }
}
