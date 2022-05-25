// import { getStateAddress } from '../src/ChargedParticles';
import { getWallet } from '../src/ethers.service';
import { sum } from '../src';
import Charged from '../src/Charged';
import { ethers } from 'ethers'


describe('blah', () => {
  it('works', () => {
    expect(sum(1, 1)).toEqual(2);
  });
});

// describe('getStateAddressTest', () => {
//   it('returns a string', async () => {
//     expect(await getStateAddress()).toEqual('0x48974C6ae5A0A25565b0096cE3c81395f604140f');
//   })
// })

describe('Charged class', () => {
  const myWallet = getWallet();
  const provider = ethers.providers.getDefaultProvider();

  it ('Initializes charged', async() => {
    expect(myWallet.address).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');
    const charged = new Charged('1', provider, myWallet);
    const walletAddressFromCharged = await charged?.signer?.getAddress();
    expect(walletAddressFromCharged).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');
  })

  it ('Create contract with signer', async() => {
    const charged = new Charged('1', provider, myWallet);
    const chargedParticlesContract = charged.chargedParticlesContract;

    const stateAddressFromContract = await chargedParticlesContract.getStateAddress();
    const signerAddress = await chargedParticlesContract.signer.getAddress( );
  
    expect(stateAddressFromContract).toEqual('0x48974C6ae5A0A25565b0096cE3c81395f604140f') 
    expect(signerAddress).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A') 
  });

  it('Creates a signed transactions', async() => {
    // const charged = new Charged('1', provider, myWallet);


  })

})
