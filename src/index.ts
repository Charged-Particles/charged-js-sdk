import Charged from './charged';

// abis
import chargedParticlesAbi from '@charged-particles/protocol-subgraph/abis/ChargedParticles.json';
import chargedSettingsAbi from '@charged-particles/protocol-subgraph/abis/ChargedSettings.json';
import chargedStateAbi from '@charged-particles/protocol-subgraph/abis/ChargedState.json';
import chargedManagersAbi from '@charged-particles/protocol-subgraph/abis/ChargedManagers.json';
import protonAbi from '@charged-particles/protocol-subgraph/abis/Proton.json';
import protonBAbi from '@charged-particles/protocol-subgraph/abis/ProtonB.json';
import aaveWalletManagerAbi from '@charged-particles/protocol-subgraph/abis/AaveWalletManager.json';
import aaveWalletManagerBAbi from '@charged-particles/protocol-subgraph/abis/AaveWalletManagerB.json';
import genericWalletManagerAbi from '@charged-particles/protocol-subgraph/abis/GenericWalletManager.json';
import genericWalletManagerBAbi from '@charged-particles/protocol-subgraph/abis/GenericWalletManagerB.json';
import genericBasketManagerAbi from '@charged-particles/protocol-subgraph/abis/GenericBasketManager.json';
import genericBasketManagerBAbi from '@charged-particles/protocol-subgraph/abis/GenericBasketManagerB.json';

// networks
import mainnetAddresses from '@charged-particles/protocol-subgraph/networks/mainnet.json';
import kovanAddresses from '@charged-particles/protocol-subgraph/networks/kovan.json';
import polygonAddresses from '@charged-particles/protocol-subgraph/networks/polygon.json';
import mumbaiAddresses from '@charged-particles/protocol-subgraph/networks/mumbai.json';
import goerliAddresses from '@charged-particles/protocol-subgraph/networks/goerli.json';
import sepoliaAddresses from '@charged-particles/protocol-subgraph/networks/sepolia.json';

export default Charged;

export {
  chargedParticlesAbi,
  chargedSettingsAbi,
  chargedManagersAbi,
  chargedStateAbi,
  protonAbi,
  protonBAbi,
  aaveWalletManagerAbi,
  aaveWalletManagerBAbi,
  genericBasketManagerAbi,
  genericBasketManagerBAbi,
  genericWalletManagerAbi,
  genericWalletManagerBAbi,
  mainnetAddresses,
  kovanAddresses,
  polygonAddresses,
  mumbaiAddresses,
  goerliAddresses,
  sepoliaAddresses,
}