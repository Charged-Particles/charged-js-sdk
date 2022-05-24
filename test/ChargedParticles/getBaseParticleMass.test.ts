import { getBaseParticleMass } from '../../src/ChargedParticles';
import { ethers } from 'ethers'
import 'dotenv/config';

// If we do not define these in our .env file the providers will fall back to default public api keys from ethers
// Api keys are not required however the tests may sometimes fail when using default public api keys
const alchemyApiKeyMainnet = process.env.ALCHEMY_APIKEY;
const alchemyApiKeyKovan = process.env.ALCHEMY_APIKEY_KOVAN;

// Using the following protons for testing
// MAINNET: https://staging.app.charged.fi/go/energize/0x63174FA9680C674a5580f7d747832B2a2133Ad8f/49
// KOVAN: https://staging.app.charged.fi/go/energize/0xd1bce91a13089b1f3178487ab8d0d2ae191c1963/18

describe('mainnet DAI', () => {
  const alcProvider = new ethers.providers.AlchemyProvider('homestead', alchemyApiKeyMainnet);
  it('should return 5000 DAI as the mass', async () => {
    const resBN = await getBaseParticleMass('0x63174FA9680C674a5580f7d747832B2a2133Ad8f', '49', 'aave', '0x6B175474E89094C44Da98b954EedeAC495271d0F', alcProvider, 1);
    const result = Number(ethers.utils.formatUnits(resBN));
    expect(result).toEqual(5000);
  })
})

describe('kovan DAI', () => {
  const alcProvider = new ethers.providers.AlchemyProvider('kovan', alchemyApiKeyKovan);
  it('should return 1000 DAI as the mass', async () => {
    const resBN = await getBaseParticleMass('0xd1bce91a13089b1f3178487ab8d0d2ae191c1963', '18', 'aave.B', '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa', alcProvider, 42);
    const result = Number(ethers.utils.formatUnits(resBN));
    expect(result).toEqual(1000);
  })
})
