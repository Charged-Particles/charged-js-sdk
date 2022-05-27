import { Contract, ethers } from 'ethers';
import { Configuration } from '../types';
import { getAddressFromNetwork } from '../utils/getAddressFromNetwork';
import { checkContractName, getAbi } from '../utils/initContract';

// import { SUPPORTED_NETWORKS } from '../utils/config';
// import { useQueries } from 'react-query';

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

    const networkFormatted:string = getAddressFromNetwork(network);
   
    // check if safe contract name was given
    checkContractName(contractName);
    
    const address = this.getAddressByNetwork(networkFormatted, contractName)

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

  public getAddressByNetwork(network:string, contractName:string):string {
    // if a unsupported chain is given. default to mainnet
    // ts ignores are used because the json files are not working nicely with typescript
    let address:string;
    switch(network) {
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

    return address;
  }

}
