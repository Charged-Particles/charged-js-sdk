// ABIs
import ChargedParticles from '@charged-particles/protocol-subgraph/abis/ChargedParticles.json';
import ChargedSettings from '@charged-particles/protocol-subgraph/abis/ChargedSettings.json';
import ChargedManagers from '@charged-particles/protocol-subgraph/abis/ChargedManagers.json';
import ChargedState from '@charged-particles/protocol-subgraph/abis/ChargedState.json';
import ProtonB from '@charged-particles/protocol-subgraph/abis/ProtonB.json';

// Types
import { NetworkContractLocations, ContractLocation } from '../types/interfaces';

// Contract addresses
import mainnetAddressesImport from '@charged-particles/protocol-subgraph/networks/mainnet.json';
import kovanAddressesImport from '@charged-particles/protocol-subgraph/networks/kovan.json';
import polygonAddressesImport from '@charged-particles/protocol-subgraph/networks/polygon.json';
import mumbaiAddressesImport from '@charged-particles/protocol-subgraph/networks/mumbai.json';

const mainnetAddresses:NetworkContractLocations = mainnetAddressesImport;
const kovanAddresses:NetworkContractLocations = kovanAddressesImport;
const polygonAddresses:NetworkContractLocations = polygonAddressesImport;
const mumbaiAddresses:NetworkContractLocations = mumbaiAddressesImport;

// Return correct ABI
export const getAbi = (contractName: string) => {
  switch (contractName) {
    case 'chargedParticles': return ChargedParticles;
    case 'chargedState': return ChargedState;
    case 'chargedSettings': return ChargedSettings;
    case 'chargedManagers': return ChargedManagers;
    case 'erc721': return ProtonB;
    default: throw `${contractName} is not valid in getAbi`;
  }
}

export const getAddress = (network: number, contractName: string) => {
  const addresses = getImportedContractLocations(network);
  const location = addresses[contractName];
  if(isContractLocation(location)) {
    return location.address;
  } else {
    throw `${contractName} is not valid in getAddress`;
  }
}

// type guard
const isContractLocation = (contract: ContractLocation | string): contract is ContractLocation  => {
  return (contract as ContractLocation).address !== undefined;
}

const getImportedContractLocations = (network: number) => {
  switch(network) {
    case 1: return mainnetAddresses;
    case 42: return kovanAddresses;
    case 137: return polygonAddresses;
    case 80001: return mumbaiAddresses;
    default: throw `network id: ${network} is not a valid network in getImportedContractLocations`;
  }
}