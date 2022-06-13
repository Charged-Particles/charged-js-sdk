import { Contract, ethers } from 'ethers';
import { ChargedState } from '../../types';
import { getAbi, getAddress } from '../../utils/contractUtilities';
export default class BaseService {
  readonly contractInstances: { [action: string]: { [address: string]: Contract } };

  readonly state: ChargedState;

  constructor(state: ChargedState) {
    this.state = state;
    this.contractInstances = {
      read: {},
      write: {}
    };
  }

  public getContractInstance(
    contractName: string,
    network: number,
    action: string,
    contractAddress?: string
  ): Contract {
    const { providers, signer } = this.state;

    const provider = providers[network] ?? providers['external'];
    const address = contractAddress ?? getAddress(network, contractName);

    if (!this.contractInstances[action][address]) {

      if (action === 'read') {
        const requestedContract = new ethers.Contract(
          address,
          getAbi(contractName),
          provider
        );

        this.contractInstances[action][address] = requestedContract;

      } else if (action === 'write') {
        if (!signer && !providers['external']) { throw new Error('Trying to write with no signer') };

        const writeProvider = signer ? signer.connect(provider) : providers['external'].getSigner();

        const requestedContract = new ethers.Contract(
          address,
          getAbi(contractName),
          writeProvider
        );

        this.contractInstances[action][address] = requestedContract;
      }
    }

    return this.contractInstances[action][address];
  }

  public async fetchAllNetworks(
    contractName: string,
    methodName: string,
    params: any[] = [],
    contractAddress?: string
  ) {
    const { providers } = this.state;

    let transactions = [];
    let networks: (number)[] = [];

    for (let network in providers) {
      // Only query contracts that exist on network
      if (contractAddress) {
        const contractExistsOnNetwork = await providers[network].getCode(contractAddress);
        if (contractExistsOnNetwork === '0x') { continue };
      }

      if (network === 'external') {
        const { chainId } = await providers['external'].getNetwork()
        network = chainId;
      }

      networks.push(Number(network));
      transactions.push(
        this.readContract(
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

  public async writeContract(
    contractName: string,
    methodName: string,
    network: number,
    params: any[] = [],
    contractAddress?: string
  ) {
    const { transactionOverride } = this.state.configuration;
    
    const action = 'write';
    const requestedContract = this.getContractInstance(contractName, network, action, contractAddress);
    return requestedContract[methodName](...params, transactionOverride);
  }

  public async readContract(
    contractName: string,
    methodName: string,
    network: number,
    params: any[] = [],
    contractAddress?: string
  ) {
    const { transactionOverride } = this.state.configuration;

    const action = 'read';
    const requestedContract = this.getContractInstance(contractName, network, action, contractAddress);
    return requestedContract.callStatic[methodName](...params, transactionOverride);
  }

  public async getSignerAddress() {
    const { signer } = this.state;

    if (signer) { return signer?.getAddress(); };

    throw new Error('No signer provided');
  }

  public async getSignerConnectedNetwork(network?: number): Promise<number> {
    const { providers } = this.state;

    const chainIds = Object.keys(providers);
    const chainIdsLength = chainIds.length;

    if (chainIdsLength) {

      if (chainIdsLength > 1 && network) {
        return network; // specify network intent when more than one provider.

      } else if (chainIdsLength == 1) {
        const chainIdFromSingleProvider = chainIds[0]; // return the network of the single provider

        if (chainIdFromSingleProvider == 'external') {
          const externalProviderNetwork = await providers['external'].getNetwork()
          return externalProviderNetwork.chainId;
        }
        else { return Number(chainIdFromSingleProvider) };

      } else {
        throw new Error('Please specify the targeted network');
      }
    } else {
      throw new Error(`Could not fetch network: from supplied providers`);
    }
  }
}