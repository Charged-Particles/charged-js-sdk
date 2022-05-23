import { getStateAddress } from '../../src/ChargedParticles';
import { ethers } from 'ethers'
import 'dotenv/config';

import mainnetAddresses from '../../src/networks/v2/mainnet.json';
import kovanAddresses from '../../src/networks/v2/kovan.json';
import polygonAddresses from '../../src/networks/v2/polygon.json';
import mumbaiAddresses from '../../src/networks/v2/mumbai.json';

const mainnetAddy = mainnetAddresses.chargedState.address;
const kovanAddy = kovanAddresses.chargedState.address;
const polygonAddy = polygonAddresses.chargedState.address;
const mumbaiAddy = mumbaiAddresses.chargedState.address;

// If we do not define these in our .env file the providers will fall back to default public api keys from ethers
// Api keys are not required however the tests may sometimes fail when using default public api keys
const alchemyApiKeyMainnet = process.env.ALCHEMY_APIKEY;
const alchemyApiKeyKovan = process.env.ALCHEMY_APIKEY_KOVAN;
const alchemyApiKeyPolygon = process.env.ALCHEMY_APIKEY_POLYGON;
const alchemyApiKeyMumbai = process.env.ALCHEMY_APIKEY_MUMBAI;
const infuraApiKeyMainnet = process.env.INFURA_APIKEY;
const etherscanApiKey = process.env.ETHERSCAN_APIKEY;

describe('getStateAddressTest', () => {
  it('return correct address with empty params.', async () => {
    expect(await getStateAddress()).toEqual(mainnetAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// NETWORK TYPE TESTING
//~~~~~~~~~~~~~~~~~~~
describe('network string (using alchemy)', () => {
  const alcProvider = new ethers.providers.AlchemyProvider('homestead', alchemyApiKeyMainnet ?? undefined);
  it('should return mainnet state address with network string given. using alchemy api', async () => {
    expect(await getStateAddress(alcProvider)).toEqual(mainnetAddy);
  })
})

describe('network chainid (using alchemy)', () => {
  const alcProvider = new ethers.providers.AlchemyProvider(1, alchemyApiKeyMainnet);
  it('should return mainnet state address with network chainid given. using alchemy api', async () => {
    expect(await getStateAddress(alcProvider)).toEqual(mainnetAddy);
  })
})

describe('network object (using alchemy)', () => {
  const networkObj = ethers.providers.getNetwork('homestead');
  const alcProvider = new ethers.providers.AlchemyProvider(networkObj, alchemyApiKeyMainnet);
  it('should return mainnet state address with network object given. using alchemy api', async () => {
    expect(await getStateAddress(alcProvider)).toEqual(mainnetAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// ALCHEMY
//~~~~~~~~~~~~~~~~~~~
describe('alchemy mainnet', () => {
  const alcProvider = new ethers.providers.AlchemyProvider('homestead', alchemyApiKeyMainnet);
  it('should return mainnet state address with alchemy provider given', async () => {
    expect(await getStateAddress(alcProvider)).toEqual(mainnetAddy);
  })
})

describe('alchemy kovan', () => {
  const alcProvider = new ethers.providers.AlchemyProvider('kovan', alchemyApiKeyKovan);
  it('should return kovan state address with alchemy provider given', async () => {
    expect(await getStateAddress(alcProvider, 'kovan')).toEqual(kovanAddy);
  })
})

describe('alchemy polygon', () => {
  const alcProvider = new ethers.providers.AlchemyProvider('matic', alchemyApiKeyPolygon);
  it('should return polygon state address with alchemy provider given', async () => {
    expect(await getStateAddress(alcProvider, 'matic')).toEqual(polygonAddy);
  })
})

describe('alchemy mumbai', () => {
  const alcProvider = new ethers.providers.AlchemyProvider('maticmum', alchemyApiKeyMumbai);
  it('should return mumbai state address with alchemy provider given', async () => {
    expect(await getStateAddress(alcProvider, 'maticmum')).toEqual(mumbaiAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// INFURA
//~~~~~~~~~~~~~~~~~~~
describe('infura mainnet', () => {
  const infuraProvider = new ethers.providers.InfuraProvider('homestead', infuraApiKeyMainnet);
  it('should return mainnet state address with infura provider given', async () => {
    expect(await getStateAddress(infuraProvider)).toEqual(mainnetAddy);
  })
})

// >> resolving mainnet
describe('infura kovan', () => {
  const infuraProvider = new ethers.providers.InfuraProvider('kovan');
  it('should return kovan state address with infura provider given', async () => {
    expect(await getStateAddress(infuraProvider, 'kovan')).toEqual(kovanAddy);
  })
})

// resolving mainnent
describe('infura polygon', () => {
  const infuraProvider = new ethers.providers.InfuraProvider('matic');
  it('should return polygon state address with infura provider given', async () => {
    expect(await getStateAddress(infuraProvider, 'matic')).toEqual(polygonAddy);
  })
})

// mainnet
describe('infura mumbai', () => {
  const infuraProvider = new ethers.providers.InfuraProvider('maticmum');
  it('should return mumbai state address with infura provider given', async () => {
    expect(await getStateAddress(infuraProvider, 'maticmum')).toEqual(mumbaiAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// ETHERSCAN
//~~~~~~~~~~~~~~~~~~~
describe('etherscan mainnet', () => {
  const etherscanProvider = new ethers.providers.EtherscanProvider('homestead', etherscanApiKey);
  it('should return mainnet state address with etherscan provider given', async () => {
    expect(await getStateAddress(etherscanProvider)).toEqual(mainnetAddy);
  })
})

// mainnet 
describe('etherscan kovan', () => {
  const etherscanProvider = new ethers.providers.EtherscanProvider('kovan', etherscanApiKey);
  it('should return kovan state address with etherscan provider given', async () => {
    expect(await getStateAddress(etherscanProvider, 'kovan')).toEqual(kovanAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// CLOUDFLARE
//~~~~~~~~~~~~~~~~~~~
describe('cloudflare mainnet', () => {
  const cfProvider = new ethers.providers.CloudflareProvider();
  it('should return mainnet state address with cloudflare provider given', async () => {
    expect(await getStateAddress(cfProvider)).toEqual(mainnetAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// POCKET
//~~~~~~~~~~~~~~~~~~~
describe('pocket mainnet', () => {
  const pocketProvider = new ethers.providers.PocketProvider();
  it('should return mainnet state address with pocket provider given', async () => {
    expect(await getStateAddress(pocketProvider)).toEqual(mainnetAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// ANKR
//~~~~~~~~~~~~~~~~~~~
describe('ankr mainnet', () => {
  const ankrProvider = new ethers.providers.AnkrProvider();
  it('should return mainnet state address with ankr provider given', async () => {
    expect(await getStateAddress(ankrProvider)).toEqual(mainnetAddy);
  })
})

describe('ankr polygon', () => {
  const ankrProvider = new ethers.providers.AnkrProvider('matic');
  it('should return polygon state address with ankr provider given', async () => {
    expect(await getStateAddress(ankrProvider, 'matic')).toEqual(polygonAddy);
  })
})
