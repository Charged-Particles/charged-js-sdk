import { Contract, ethers } from 'ethers';
import { Configuration } from '../types';
import { getAddressFromNetwork } from '../utils/getAddressFromNetwork';
import { checkContractName, getAbi } from '../utils/initContract';

// ABIs
import mainnetAddresses from '../networks/v2/mainnet.json';
import kovanAddresses from '../networks/v2/kovan.json';
import polygonAddresses from '../networks/v2/polygon.json';
import mumbaiAddresses from '../networks/v2/mumbai.json';

export default class BaseService {
  readonly contractInstances: { [address: string]: Contract };

  readonly config: Configuration;

  constructor(config: Configuration) {
    this.config = config;
    this.contractInstances = {};
  }

  public getContractInstance (contractName:string): Contract{
    const { network, provider, signer } = this.config;

    const networkFormatted:String = getAddressFromNetwork(network);
    
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
      provider
    );
      
    if(signer && provider) {
      const connectedWallet = signer.connect(provider);
      requestedContract = requestedContract.connect(connectedWallet);
     }

    return requestedContract;
  }

}
