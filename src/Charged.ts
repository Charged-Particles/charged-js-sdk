import { ethers, providers, Signer, Wallet, BigNumberish } from "ethers";
import { getAbi, checkContractName } from "./utils/initContract";
import { getAddressFromNetwork } from "./utils/getAddressFromNetwork";

// Types 
import { Networkish } from "@ethersproject/networks";
import { DefaultProviderKeys, Configuration } from "./types";

// ABIs
import mainnetAddresses from './networks/v2/mainnet.json';
import kovanAddresses from './networks/v2/kovan.json';
import polygonAddresses from './networks/v2/polygon.json';
import mumbaiAddresses from './networks/v2/mumbai.json';

export default class Charged  {
  network: Networkish | undefined;
  provider: providers.Provider | undefined;
  signer: Wallet | Signer  | undefined;
  chargedParticlesContract;
  chargedParticlesMethods;

  readonly configuration: Configuration;

  constructor(
   network: Networkish,
   injectedProvider?: providers.Provider | providers.ExternalProvider | string,
   signer?: Wallet | Signer | undefined, // TODO: default valu
   defaultProviderKeys?: DefaultProviderKeys,

   //provider
   //signer
   //defaultProvider {keys, network}
   ) {
    this.network = network;
    this.signer = signer;

    if (!injectedProvider) {
      if (Boolean(defaultProviderKeys)) {
        provider = ethers.getDefaultProvider(network, defaultProviderKeys);
      } else {
        provider = ethers.getDefaultProvider(network);
        console.log(
          `Charged particles: These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
          It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
        );
      }
    }  else if (typeof injectedProvider === 'string') {
      provider = new providers.StaticJsonRpcProvider(injectedProvider, network);
    } else if (injectedProvider instanceof providers.Provider) {
      provider = injectedProvider;
    } else if (injectedProvider instanceof providers.EtherscanProvider){
      provider = new providers.Web3Provider(injectedProvider, network);
    } else {
      //TODO: error msg
    }

    this.configuration = {network, provider, signer}
    //Exposing all contract methds
    this.chargedParticlesContract = this.initContract('chargedParticles');

    // Alternative, expose all methos
    this.chargedParticlesMethods = {...this.chargedParticlesContract.functions}
  }

  private initContract (contractName:string){
    const networkFormatted:String = getAddressFromNetwork(this.network);
    
    // check if safe contract name was given
    checkContractName(contractName);
  
    // if a unsupported chain is given. default to mainnet
    // ts ignores are used because the json files are not working nicely with typescript
    let address:string;
    switch(networkFormatted) {
      // @ts-ignore
       case 'mainnet': address = mainnetAddresses[contractName].address; break;
      // @ts-ignore
       case 'kovan': address = kovanAddresses[contractName].address; break;
      // @ts-ignore
       case 'polygon': address = polygonAddresses[contractName].address; break;
      // @ts-ignore
       case 'mumbai': address = mumbaiAddresses[contractName].address; break;
      // @ts-ignore
       default: address = mainnetAddresses[contractName].address; break;
    }
  
    let requestedContract = new ethers.Contract(
      address,
      getAbi(contractName),
      this.provider
    );
      
    if(this.signer && this.provider) {
      const connectedWallet = this.signer.connect(this.provider);
      requestedContract = requestedContract.connect(connectedWallet);
     }

    return requestedContract;
  }

  /// @notice returns the state adress from the ChargedParticles contract
  /// @param provider - optional parameter. if not defined the code will use the ethers default provider.
  /// @returns string of state address
  public async getStateAddress() {
    const stateAddress:String = await this.chargedParticlesContract.getStateAddress();
    return stateAddress;
  }

  /// @notice Release NFT Assets from the Particle
  /// @param receiver             The Address to Receive the Released Asset Tokens
  /// @param contractAddress      The Address to the Contract of the Token to Energize
  /// @param tokenId              The ID of the Token to Energize
  /// @param basketManagerId      The Basket to Deposit the NFT into
  /// @param nftTokenAddress      The Address of the NFT Token being deposited
  /// @param nftTokenId           The ID of the NFT Token being deposited
  /// @param nftTokenAmount       The amount of Tokens to Withdraw (ERC1155-specific)
  public async breakCovalentBond (
    contractAddress:String,
    tokenId:BigNumberish,
    basketManagerId:String, 
    nftTokenAddress:String, 
    nftTokenId:BigNumberish, 
    nftTokenAmount:BigNumberish, 
  ) {
    const trx = await this.chargedParticlesContract.breakCovalentBond(
      contractAddress, 
      tokenId, 
      basketManagerId,
      nftTokenAddress, 
      nftTokenId, 
      nftTokenAmount
    );

    const response = await trx.wait();
    
    return {response, trx};
 }
}