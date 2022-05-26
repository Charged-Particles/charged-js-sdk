// External Frameworks
import { ethers } from 'ethers';
import { Networkish } from '@ethersproject/networks'

// ABIs
import ChargedParticles from '../abis/v2/ChargedParticles.json';
import ChargedSettings from '../abis/v2/ChargedSettings.json';
import ChargedManagers from '../abis/v2/ChargedManagers.json';
import ChargedState from '../abis/v2/ChargedState.json';

// Components
import { MultiProvider, MultiSigner } from '../types';
import { getAddressFromNetwork } from './getAddressFromNetwork';

import mainnetAddresses from '../networks/v2/mainnet.json';
import kovanAddresses from '../networks/v2/kovan.json';
import polygonAddresses from '../networks/v2/polygon.json';
import mumbaiAddresses from '../networks/v2/mumbai.json';


// Boilerplate. Returns the CP contract with the correct provider. If a signer is given, the writeContract will be created as well.
export const initContract = (contractName:string, providerOrSigner?:MultiProvider | MultiSigner, network?:Networkish) => {
  const networkFormatted:String = getAddressFromNetwork(network);
  const defaultProvider:ethers.providers.BaseProvider = ethers.providers.getDefaultProvider();
  
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


  return new ethers.Contract(
     address,
     getAbi(contractName),
     providerOrSigner ?? defaultProvider
  );
}

// Check for safe values
export const checkContractName = (contractName:string) => {
  switch(contractName) {
    case 'chargedParticles': return;
    case 'chargedState': return;
    case 'chargedSettings': return;
    case 'chargedManagers': return;
    default: throw 'bad contract name passed to initContract';
  }
}

// Return correct ABI
export const getAbi = (contractName:string) => {
  switch(contractName) {
    case 'chargedParticles': return ChargedParticles;
    case 'chargedState': return ChargedState;
    case 'chargedSettings': return ChargedSettings;
    case 'chargedManagers': return ChargedManagers;
    default: throw 'unknown contract name while trying to get abi';
  }
}