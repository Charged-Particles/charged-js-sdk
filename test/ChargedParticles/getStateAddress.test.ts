import Charged from '../../src/Charged';
import { getStateAddress } from '../../src/ChargedParticles';
import { ethers } from 'ethers'
import 'dotenv/config';

describe('getStateAddressTest', () => {
  it('return correct string with empty params.', async () => {
    expect(await getStateAddress()).toEqual('0x48974C6ae5A0A25565b0096cE3c81395f604140f');
  })
})

describe('alchemy provider', () => {
  const alcProvider = new ethers.providers.AlchemyProvider(process.env.ALCHEMY_API_KEY);
  it('should return mainnet state address with alchemy provider given', async () => {
    expect(await getStateAddress(alcProvider)).toEqual('0x48974C6ae5A0A25565b0096cE3c81395f604140f');
  })
})
