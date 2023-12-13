// ABIs
import ChargedParticles from '@charged-particles/protocol-subgraph/abis/ChargedParticles.json';
import ChargedSettings from '@charged-particles/protocol-subgraph/abis/ChargedSettings.json';
import ChargedManagers from '@charged-particles/protocol-subgraph/abis/ChargedManagers.json';
import ChargedState from '@charged-particles/protocol-subgraph/abis/ChargedState.json';
import ProtonC from '@charged-particles/protocol-subgraph/abis/ProtonC.json';
import fungibleERC1155 from '@charged-particles/protocol-subgraph/abis/ERC1155.json';
import ERC20 from '@charged-particles/protocol-subgraph/abis/ERC20.json';
import Web3Pack from '../abi/Web3Pack.json';

// Types
import { NetworkContractLocations, ContractLocation } from '../types/interfaces';

// Contract addresses
import mainnetAddressesImport from '@charged-particles/protocol-subgraph/networks/mainnet.json';
import kovanAddressesImport from '@charged-particles/protocol-subgraph/networks/kovan.json';
import polygonAddressesImport from '@charged-particles/protocol-subgraph/networks/polygon.json';
import mumbaiAddressesImport from '@charged-particles/protocol-subgraph/networks/mumbai.json';
import goerliAddressImport from '@charged-particles/protocol-subgraph/networks/goerli.json';
import mantleTestnetAddressImport from '@charged-particles/protocol-subgraph/networks/mantletest.json';
import mantleAddressImport from '@charged-particles/protocol-subgraph/networks/mantlemainnet.json';

const mainnetAddresses: NetworkContractLocations = mainnetAddressesImport;
const kovanAddresses: NetworkContractLocations = kovanAddressesImport;
const polygonAddresses: NetworkContractLocations = polygonAddressesImport;
const mumbaiAddresses: NetworkContractLocations = mumbaiAddressesImport;
const goerliAddress: NetworkContractLocations = goerliAddressImport;
const mantleTestnetAddress: NetworkContractLocations = mantleTestnetAddressImport;
const mantleAddress: NetworkContractLocations = mantleAddressImport;

// Return correct ABI
export const getAbi = (contractName: string) => {
  switch (contractName) {
    case 'chargedParticles': return ChargedParticles;
    case 'chargedState': return ChargedState;
    case 'chargedSettings': return ChargedSettings;
    case 'chargedManagers': return ChargedManagers;
    case 'fungibleERC1155': return fungibleERC1155;
    case 'erc721': return ProtonC;
    case 'ionx': return ERC20;
    case 'web3pack': return Web3Pack;
    default: throw `${contractName} is not valid in getAbi`;
  }
}

export const getAddress = (network: number, contractName: string) => {
  const addresses = getImportedContractLocations(network);
  const location = addresses[contractName];
  if(isContractLocation(location)) {
    return location.address;
  } else {
    throw `${contractName} on chain ID ${network} is not valid in getAddress`;
  }
}

// type guard
const isContractLocation = (contract: ContractLocation | string): contract is ContractLocation  => {
  return (contract as ContractLocation).address !== undefined;
}

const getImportedContractLocations = (network: number) => {
  switch(network) {
    case 1: return mainnetAddresses;
    case 5: return goerliAddress;
    case 42: return kovanAddresses;
    case 137: return polygonAddresses;
    case 5001: return mantleTestnetAddress;
    case 5000: return mantleAddress;
    case 80001: return mumbaiAddresses;
    default: throw `network id: ${network} is not a valid network in getImportedContractLocations`;
  }
}