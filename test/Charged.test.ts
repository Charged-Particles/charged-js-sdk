import { ethers } from 'ethers'

import { getWallet } from '../src/utils/ethers.service';
import { rpcUrlMainnet } from '../src/utils/config';
import Charged from '../src/Charged';


describe('Charged class', () => {
  const network = 1;
  const myWallet = getWallet();
  const defaultProvider = ethers.providers.getDefaultProvider(network);

  const checkStateContractMainnetAddress = async (charged: Charged) => {
    const stateAddressFromContractMainnet = await charged.chargedParticlesContract.getStateAddress();
    expect(stateAddressFromContractMainnet).toEqual('0x48974C6ae5A0A25565b0096cE3c81395f604140f');
  }

  it('Evaluates correct network', async() => {
    const charged = new Charged({network, provider: defaultProvider, signer: myWallet});
    const usedNetwork = await charged?.provider?.getNetwork();
    expect(usedNetwork?.chainId).toEqual(network);
  });

  it ('Initializes charged with etherJS provider', async() => {
    expect(myWallet.address).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');
    const charged = new Charged({network, provider: defaultProvider});
    
    const walletAddressFromCharged = await charged?.signer?.getAddress();
    expect(walletAddressFromCharged).toEqual(undefined);

    await checkStateContractMainnetAddress(charged);
  });

  it ('Create contract with with etherJs signer & provider', async() => {
    const charged = new Charged({network, provider: defaultProvider, signer: myWallet});

    await checkStateContractMainnetAddress(charged);

    const signerAddress = await charged?.signer?.getAddress();
    expect(signerAddress).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');
  });

  it ('Initialize Charged with no params', async() => {
    const charged = new Charged();
    await checkStateContractMainnetAddress(charged);  })

  it ('Initializes Charged with url provider', async() => {
    const charged = new Charged({provider: rpcUrlMainnet});
    await checkStateContractMainnetAddress(charged); 
    expect(charged.signer).toBe(undefined);
  })

  it ('Initializes Charged API keys', async() => {
    const defaultProviderKeys = {'alchemy': 'qw02QqWNMg2kby3q3N39PxUT3KaRS5UE'};
    const charged = new Charged({provider: defaultProvider, defaultProviderKeys});
    await checkStateContractMainnetAddress(charged); 
  })

  it ('Initializes Charged with web3 ', async() => {

  })
});
