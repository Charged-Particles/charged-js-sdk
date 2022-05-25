import { ethers, providers, Signer, Wallet, BigNumberish } from "ethers";
import { initContract } from "./ChargedParticles";

// Types 
import { Networkish } from "@ethersproject/networks";
import { DefaultProviderKeys } from "./types";

export default class Charged  {
  network: Networkish | undefined;
  provider: providers.Provider | undefined;
  signer: Wallet | Signer  | undefined;
  chargedParticlesContract;
  chargedParticlesMethods;

  constructor(
   network: Networkish,
   injectedProvider?: providers.Provider | providers.ExternalProvider,
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
        this.provider = ethers.getDefaultProvider(network, defaultProviderKeys);
      } else {
        this.provider = ethers.getDefaultProvider(network);
        console.log(
          `Charged particles: These API keys are a provided as a community resource by the backend services for low-traffic projects and for early prototyping.
          It is highly recommended to use own keys: https://docs.ethers.io/v5/api-keys/`
        );
      }
    }  else if (typeof injectedProvider === 'string') {
      this.provider = new providers.StaticJsonRpcProvider(injectedProvider, network);
    } else if (injectedProvider instanceof providers.Provider) {
      this.provider = injectedProvider;
    } else if (injectedProvider instanceof providers.EtherscanProvider){
      this.provider = new providers.Web3Provider(injectedProvider, network);
    } else {
      //TODO: error msg
    }

    //Exposing all contract methds
    this.chargedParticlesContract = initContract(this.provider, this.network, this.signer);


    // Alternative, expose all methos
    this.chargedParticlesMethods = {...this.chargedParticlesContract.functions}
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