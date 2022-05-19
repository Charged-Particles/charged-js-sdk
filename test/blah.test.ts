import { getStateAddress } from '../src/ChargedParticles';
import { sum } from '../src';
import Charged from '../src/Charged';
import { ethers } from 'ethers'


describe('blah', () => {
  it('works', () => {
    expect(sum(1, 1)).toEqual(2);
  });
});

describe('getStateAddressTest', () => {
  it('returns a string', async () => {
    expect(await getStateAddress()).toEqual('0x48974C6ae5A0A25565b0096cE3c81395f604140f');
  })
})

describe('Charged class', () => {
  const provider = ethers.providers.getDefaultProvider();
  const charged = new Charged('RPC_URL',provider);

  it('Should create the class', async () => {
    expect(charged.RPC_URL).toEqual('RPC_URL');
    expect(await charged.provider.getNetwork()).toHaveProperty('chainId');
  })

  it('Get charged particle contract', async () => {
    // const charged = new Charged('RPC_URL',provider);
    const chargeParticleContract = charged.getChargeParticleContract();
    const stateContractAddress = await chargeParticleContract.getStateAddress();

    expect(stateContractAddress).toEqual('0x48974C6ae5A0A25565b0096cE3c81395f604140f');
  })
})
