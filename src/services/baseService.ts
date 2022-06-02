import { Contract, ethers } from 'ethers';
import { Configuration } from '../types';
import { getAddressFromNetwork } from '../utils/getAddressFromNetwork';
import { isValidContractName, getAbi, getAddressByNetwork } from '../utils/initContract';
import { SUPPORTED_NETWORKS } from '../utils/getAddressFromNetwork';
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
  
  public async getChainIdsForBridgedNFTs(contractAddress: string, tokenId: number) {
    const { providers, externalProvider } = this.config;

    const rawData: object[] = [];
    // const bridgedData: object[] = [];

    console.log({externalProvider, tokenId})

    // new ethers.providers.Web3Provider(externalProvider)

    try {
      for await (const network of SUPPORTED_NETWORKS) {
        let chainId = String(network.chainId);
        const provider = providers[chainId] ?? ethers.getDefaultProvider(chainId);

        // console.log('checking for ', {chainId, 'providers': providers[chainId]});
        let contractExists = await provider.getCode(contractAddress);
        // console.log({contractExists});
        if (contractExists !== '0x') {                                                // contract exists on respective network
          // let contract = new ethers.Contract(
          //   contractAddress,
          //   getAbi('protonB'),
          //   provider
          //   );
          // let owner = await contract.ownerOf(tokenId);
            rawData.push({'chainId': Number(chainId)});
          }
        }
    } catch (error) {
      // throw error;
    }

    // if we find it is on multiple chains, then we have to find the owner of nft and store it for each chain
    // when we go to write check if the owner matches the signer
    
    console.log({rawData});

    return rawData;
  }

  public getSigner() {

    const { signer, externalProvider } = this.config;

    if (signer) {
      return signer;
    } else if (externalProvider) {
      return externalProvider;
    }
    
  }


}
