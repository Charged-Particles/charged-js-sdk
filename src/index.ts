import Charged from './charged';

// TODO: Include leptons etc?
// abis
import chargedParticles from '@charged-particles/protocol-subgraph/abis/ChargedParticles.json';
import chargedSettings from '@charged-particles/protocol-subgraph/abis/ChargedSettings.json';
import chargedState from '@charged-particles/protocol-subgraph/abis/ChargedState.json';
import chargedManagers from '@charged-particles/protocol-subgraph/abis/ChargedManagers.json';
import proton from '@charged-particles/protocol-subgraph/abis/Proton.json';
import protonB from '@charged-particles/protocol-subgraph/abis/ProtonB.json';
import aaveWalletManager from '@charged-particles/protocol-subgraph/abis/AaveWalletManager.json';
import aaveWalletManagerB from '@charged-particles/protocol-subgraph/abis/AaveWalletManagerB.json';
import genericWalletManager from '@charged-particles/protocol-subgraph/abis/GenericWalletManager.json';
import genericWalletManagerB from '@charged-particles/protocol-subgraph/abis/GenericWalletManagerB.json';
import genericBasketManager from '@charged-particles/protocol-subgraph/abis/GenericBasketManager.json';
import genericBasketManagerB from '@charged-particles/protocol-subgraph/abis/GenericBasketManagerB.json';

// networks
import mainnet from '@charged-particles/protocol-subgraph/networks/mainnet.json';
import kovan from '@charged-particles/protocol-subgraph/networks/kovan.json';
import polygon from '@charged-particles/protocol-subgraph/networks/polygon.json';
import mumbai from '@charged-particles/protocol-subgraph/networks/mumbai.json';

export default Charged;

export const abisAndNetworks = {
  chargedParticles,
  chargedManagers,
  chargedSettings,
  chargedState,
  proton,
  protonB,
  aaveWalletManager,
  aaveWalletManagerB,
  genericWalletManager,
  genericWalletManagerB,
  genericBasketManager,
  genericBasketManagerB,
  mainnet,
  kovan,
  polygon,
  mumbai,
}