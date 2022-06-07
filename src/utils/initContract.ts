// External Frameworks
import { ethers } from 'ethers';
import { Networkish } from '@ethersproject/networks'

// ABIs
import ChargedParticles from '../abis/v2/ChargedParticles.json';
import ChargedSettings from '../abis/v2/ChargedSettings.json';
import ChargedManagers from '../abis/v2/ChargedManagers.json';
import ChargedState from '../abis/v2/ChargedState.json';
import ProtonB from '../abis/v2/ProtonB.json';

// Components
import { MultiProvider, MultiSigner } from '../types';
import { getAddressFromNetwork } from './getAddressFromNetwork';

// Contract addresses
import mainnetAddresses from '../networks/v2/mainnet.json';
import kovanAddresses from '../networks/v2/kovan.json';
import polygonAddresses from '../networks/v2/polygon.json';
import mumbaiAddresses from '../networks/v2/mumbai.json';

// Boilerplate. Returns the CP contract with the correct provider. If a signer is given, the writeContract will be created as well.
export const initContract = (contractName:string, providerOrSigner?:MultiProvider | MultiSigner, network?:Networkish) => {
  const networkFormatted:String = getAddressFromNetwork(network);
  const defaultProvider:ethers.providers.BaseProvider = ethers.providers.getDefaultProvider();

  // check if safe contract name was given
  isValidContractName(contractName);

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
export const isValidContractName = (contractName:string) => {
  switch(contractName) {
    case 'chargedParticles': return;
    case 'chargedState': return;
    case 'chargedSettings': return;
    case 'chargedManagers': return;
    case 'erc721': return;
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
    case 'erc721': return ProtonB;
    default: throw 'unknown contract name while trying to get abi';
  }
}

export const getAddressByNetwork = (network: Networkish, contractName: string):string =>{
   isValidContractName(contractName);

  // if a unsupported chain is given. default to mainnet
  // TODO: ts ignores are used because the json files are not working nicely with typescript
  let address:string;
  switch(getAddressFromNetwork(network)) {
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
/**
* Checks if the given string is a checksummed address
*  Same as ethers.utils.isAddress()  or convert with ethers.utils.getAddress()
* @method isChecksumAddress
* @param {String} address the given HEX adress
* @return {Boolean}
*/
export const isChecksumAddress = (address:string) => {
  // Check each case
  address = address.replace('0x','');
  var addressHash = ethers.utils.keccak256(address.toLowerCase());
  for (var i = 0; i < 40; i++ ) {
      // the nth letter should be uppercase if the nth digit of casemap is 1
      if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
          return false;
      }
  }
  return true;
};

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
export const isAddress = (address: string): boolean => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // check if it has the basic requirements of an address
      return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
      // If it's all small caps or all all caps, return true
      return true;
  } else {
      // Otherwise check each case
      return isChecksumAddress(address);
  }
};
