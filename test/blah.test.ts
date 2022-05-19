// import { sum } from '../src';
import { getStateAddress } from '../src/ChargedParticles';

// describe('blah', () => {
//   it('works', () => {
//     expect(sum(1, 1)).toEqual(2);
//   });
// });

describe('getStateAddressTest', () => {
  it('returns a string', async () => {
    expect(await getStateAddress()).toEqual('0x48974C6ae5A0A25565b0096cE3c81395f604140f');
  })
})