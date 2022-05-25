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
  expect(myWallet.address).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');

  const provider = ethers.providers.getDefaultProvider();
  const charged = new Charged('1', provider, myWallet);

  const walletAddressFromCharged = charged?.wallet?.address
  expect(walletAddressFromCharged).toEqual('0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A');
})
