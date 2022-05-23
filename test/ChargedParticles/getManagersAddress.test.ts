import { getManagersAddress } from '../../src/ChargedParticles';
import { ethers } from 'ethers'
import 'dotenv/config';

import mainnetAddresses from '../../src/networks/v2/mainnet.json';
import kovanAddresses from '../../src/networks/v2/kovan.json';
import polygonAddresses from '../../src/networks/v2/polygon.json';
import mumbaiAddresses from '../../src/networks/v2/mumbai.json';

const mainnetAddy = mainnetAddresses.chargedManagers.address;
const kovanAddy = kovanAddresses.chargedManagers.address;
const polygonAddy = polygonAddresses.chargedManagers.address;
const mumbaiAddy = mumbaiAddresses.chargedManagers.address;

// If we do not define these in our .env file the providers will fall back to default public api keys from ethers
// Api keys are not required however the tests may sometimes fail when using default public api keys
const alchemyApiKeyMainnet = process.env.ALCHEMY_APIKEY;
const alchemyApiKeyKovan = process.env.ALCHEMY_APIKEY_KOVAN;
const alchemyApiKeyPolygon = process.env.ALCHEMY_APIKEY_POLYGON;
const alchemyApiKeyMumbai = process.env.ALCHEMY_APIKEY_MUMBAI;

describe('getStateAddressTest', () => {
  it('return correct address with empty params.', async () => {
    expect(await getManagersAddress()).toEqual(mainnetAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// NETWORK TYPE TESTING
//~~~~~~~~~~~~~~~~~~~
describe('network string (using alchemy)', () => {
  const alcProvider = new ethers.providers.AlchemyProvider('homestead', alchemyApiKeyMainnet ?? undefined);
  it('should return mainnet state address with network string given. using alchemy api', async () => {
    expect(await getManagersAddress(alcProvider)).toEqual(mainnetAddy);
  })
})

describe('network chainid (using alchemy)', () => {
  const alcProvider = new ethers.providers.AlchemyProvider(1, alchemyApiKeyMainnet);
  it('should return mainnet state address with network chainid given. using alchemy api', async () => {
    expect(await getManagersAddress(alcProvider)).toEqual(mainnetAddy);
  })
})

describe('network object (using alchemy)', () => {
  const networkObj = ethers.providers.getNetwork('homestead');
  const alcProvider = new ethers.providers.AlchemyProvider(networkObj, alchemyApiKeyMainnet);
  it('should return mainnet state address with network object given. using alchemy api', async () => {
    expect(await getManagersAddress(alcProvider)).toEqual(mainnetAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// ALCHEMY
//~~~~~~~~~~~~~~~~~~~
describe('alchemy mainnet', () => {
  const alcProvider = new ethers.providers.AlchemyProvider('homestead', alchemyApiKeyMainnet);
  it('should return mainnet state address with alchemy provider given', async () => {
    expect(await getManagersAddress(alcProvider)).toEqual(mainnetAddy);
  })
})

describe('alchemy kovan', () => {
  const alcProvider = new ethers.providers.AlchemyProvider('kovan', alchemyApiKeyKovan);
  it('should return kovan state address with alchemy provider given', async () => {
    expect(await getManagersAddress(alcProvider, 'kovan')).toEqual(kovanAddy);
  })
})

describe('alchemy polygon', () => {
  const alcProvider = new ethers.providers.AlchemyProvider('matic', alchemyApiKeyPolygon);
  it('should return polygon state address with alchemy provider given', async () => {
    expect(await getManagersAddress(alcProvider, 'matic')).toEqual(polygonAddy);
  })
})

describe('alchemy mumbai', () => {
  const alcProvider = new ethers.providers.AlchemyProvider('maticmum', alchemyApiKeyMumbai);
  it('should return mumbai state address with alchemy provider given', async () => {
    expect(await getManagersAddress(alcProvider, 'maticmum')).toEqual(mumbaiAddy);
  })
})
