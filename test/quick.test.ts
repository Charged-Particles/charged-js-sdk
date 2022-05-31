import { BigNumber, ethers } from 'ethers'

import { getWallet } from '../src/utils/ethers.service';
// import { rpcUrlMainnet, rpcUrlKovan } from '../src/utils/config';
import Charged from '../src/Charged';


describe('Charged class', () => {
  const network = 42;
  const myWallet = getWallet();
  const defaultProvider = ethers.providers.getDefaultProvider(network);

  it('shoudl yeah', async () => {
    const charged = new Charged({network, provider: defaultProvider, signer: myWallet})
    const stateAddressFromContractMainnet = await charged.chargedParticlesContract.getStateAddress();
    expect(stateAddressFromContractMainnet).toEqual('0x48974C6ae5A0A25565b0096cE3c81395f604140f');
  })

  it('should energize a particle on kovan', async() => {
    const charged = new Charged({network, provider: defaultProvider, signer: myWallet})
    const result = await charged.chargedParticlesContract.energizeParticle('0xd1bce91a13089b1f3178487ab8d0d2ae191c1963', 18, 'aave.B', '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD', BigNumber.from(10));
    console.log(result);
  })

  // it('Evaluates correct network', async() => {
  //   const charged = new Charged({network, provider: defaultProvider, signer: myWallet});
  //   const usedNetwork = await charged?.provider?.getNetwork();
  //   expect(usedNetwork?.chainId).toEqual(network);
  // });
});
