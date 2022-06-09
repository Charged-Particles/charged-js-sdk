// External Frameworks
import { ethers } from 'ethers';

// ABIs
import ChargedParticles from '../abis/v2/ChargedParticles.json';
import ChargedSettings from '../abis/v2/ChargedSettings.json';
import ChargedManagers from '../abis/v2/ChargedManagers.json';
import ChargedState from '../abis/v2/ChargedState.json';
import ProtonB from '../abis/v2/ProtonB.json';

// Components
import { MultiProvider, MultiSigner } from '../types';
import { NetworkUniverseJSON, slay } from '../types/interfaces';
import { getChainNameById } from './networkUtilities';

// Contract addresses
import mainnetAddressesImport from '../networks/v2/mainnet.json';
import kovanAddressesImport from '../networks/v2/kovan.json';
import polygonAddressesImport from '../networks/v2/polygon.json';
import mumbaiAddressesImport from '../networks/v2/mumbai.json';

const mainnetAddresses:slay = mainnetAddressesImport;
const kovanAddresses:NetworkUniverseJSON = kovanAddressesImport;
const polygonAddresses:NetworkUniverseJSON = polygonAddressesImport;
const mumbaiAddresses:NetworkUniverseJSON = mumbaiAddressesImport;


// Boilerplate. Returns the CP contract with the correct provider. If a signer is given, the writeContract will be created as well.
export const initContract = (contractName: string, providerOrSigner?: MultiProvider | MultiSigner, network?: number) => {
  const networkFormatted: String = getChainNameById(network);
  const defaultProvider: ethers.providers.BaseProvider = ethers.providers.getDefaultProvider();

  // check if safe contract name was given
  isValidContractName(contractName);

  // if a unsupported chain is given. default to mainnet
  // ts ignores are used because the json files are not working nicely with typescript
  let address: string;
  switch (networkFormatted) {
    case 'mainnet': address = mainnetAddresses[contractName].address; break;
    case 'kovan': address = kovanAddresses[contractName].address; break;
    case 'polygon': address = polygonAddresses[contractName].address; break;
    case 'mumbai': address = mumbaiAddresses[contractName].address; break;
    default: address = mainnetAddresses[contractName].address; break;
  }


  return new ethers.Contract(
    address,
    getAbi(contractName),
    providerOrSigner ?? defaultProvider
  );
}

// Check for safe values
export const isValidContractName = (contractName: string) => {
  switch (contractName) {
    case 'chargedParticles': return;
    case 'chargedState': return;
    case 'chargedSettings': return;
    case 'chargedManagers': return;
    case 'erc721': return;
    default: throw 'bad contract name passed to initContract';
  }
}

// Return correct ABI
export const getAbi = (contractName: string) => {
  switch (contractName) {
    case 'chargedParticles': return ChargedParticles;
    case 'chargedState': return ChargedState;
    case 'chargedSettings': return ChargedSettings;
    case 'chargedManagers': return ChargedManagers;
    case 'erc721': return ProtonB;
    default: throw 'unknown contract name while trying to get abi';
  }
}

export const getAddressByNetwork = (network: number, contractName: string): string => {
  isValidContractName(contractName);

  // if a unsupported chain is given. default to mainnet
  let address: string;
  switch (getChainNameById(network)) {
    case 'mainnet': address = mainnetAddresses[contractName].address; break;
    case 'kovan': address = kovanAddresses[contractName].address; break;
    case 'polygon': address = polygonAddresses[contractName].address; break;
    case 'mumbai': address = mumbaiAddresses[contractName].address; break;
    default: address = mainnetAddresses[contractName].address; break;
  }
  return address;
}