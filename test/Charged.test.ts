import { getWallet } from '../src/ethers.service';
// import { getFormatedromNetwork, getAddressByNetwork } from '../src/ChargedParticles';
import { ethers } from 'ethers'
import Charged from '../src/Charged';

describe('Charged class', () => {
  const network = 1;
  const myWallet = getWallet();
  const provider = ethers.providers.getDefaultProvider(network);

  it ('Initializes charged', async() => {
    expect(myWallet.address).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');
    const charged = new Charged(network, provider, myWallet);
    const walletAddressFromCharged = await charged?.signer?.getAddress();
    expect(walletAddressFromCharged).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');
  });

  it ('Create contract with signer', async() => {
    const charged = new Charged(network, provider, myWallet);

    const stateAddressFromContractMainnet = await charged.chargedParticlesContract.getStateAddress();
    const signerAddress = await charged?.signer?.getAddress();
    
    expect(stateAddressFromContractMainnet).toEqual('0x48974C6ae5A0A25565b0096cE3c81395f604140f');
    expect(signerAddress).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');
  });

  it('Evaluates correct network', async() => {
    const charged = new Charged(network, provider, myWallet);
    const usedNetwork = await charged?.provider?.getNetwork();
    expect(usedNetwork?.chainId).toEqual(network);
  });
});
