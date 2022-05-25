// import { getStateAddress } from '../src/ChargedParticles';
import { getWallet } from '../src/ethers.service';
import Charged from '../src/Charged';
import { ethers } from 'ethers'

describe('Charged class', () => {
  const myWallet = getWallet();
  const provider = ethers.providers.getDefaultProvider(42);

  it ('Initializes charged', async() => {
    expect(myWallet.address).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');
    const charged = new Charged(provider, myWallet);
    const walletAddressFromCharged = await charged?.signer?.getAddress();
    expect(walletAddressFromCharged).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');
  });

  it ('Create contract with signer', async() => {
    const charged = new Charged(provider, myWallet);
    const chargedParticlesContract = charged.chargedParticlesContract;

    const stateAddressFromContract = await chargedParticlesContract.getStateAddress();
    const signerAddress = await chargedParticlesContract.signer.getAddress( );
  
    expect(stateAddressFromContract).toEqual('0x48974C6ae5A0A25565b0096cE3c81395f604140f') 
    expect(signerAddress).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A') 
  });

  it('Evaluates correct network', async() => {
    const charged = new Charged(provider, myWallet);
    const usedNetwork = await charged?.provider?.getNetwork();
    console.log(usedNetwork)
  });
});
