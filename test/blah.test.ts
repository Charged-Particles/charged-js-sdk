// import { getStateAddress } from '../src/ChargedParticles';
import { getWallet } from '../src/ethers.service';
import Charged from '../src/Charged';
import { ethers } from 'ethers'

describe('Charged class', () => {
  const network = 42;
  const myWallet = getWallet();
  const provider = ethers.providers.getDefaultProvider(network);

  it ('Initializes charged', async() => {
    expect(myWallet.address).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');
    const charged = new Charged('42', provider, myWallet);
    const walletAddressFromCharged = await charged?.signer?.getAddress();
    expect(walletAddressFromCharged).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');
  });

  it ('Create contract with signer', async() => {
    const charged = new Charged(network, provider, myWallet);

    const stateAddressFromContract = await charged.getStateAddress();
    const signerAddress = await charged?.signer?.getAddress();
  
    expect(stateAddressFromContract).toEqual('0x121da37d04D1405d96cFEa65F79Eaa095C2582Ca') 
    expect(signerAddress).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A') 
  });

  it('Evaluates correct network', async() => {
    const charged = new Charged(network, provider, myWallet);
    const usedNetwork = await charged?.provider?.getNetwork();
    expect(usedNetwork?.chainId).toEqual(network);
  });
});
