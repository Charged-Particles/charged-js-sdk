import { getStateAddress } from '../../src/ChargedParticles';
import { ethers } from 'ethers'
import 'dotenv/config';

const mainnetAddy = '0x48974C6ae5A0A25565b0096cE3c81395f604140f';
const kovanAddy = '0x121da37d04D1405d96cFEa65F79Eaa095C2582Ca';
const polygonAddy = '0x581c57b86fC8c2D639f88276478324cE1380979D';
const mumbaiAddy = '0x9c00b8CF03f58c0420CDb6DE72E27Bf11964025b';

describe('getStateAddressTest', () => {
  it('return correct address with empty params.', async () => {
    expect(await getStateAddress()).toEqual(mainnetAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// NETWORK TYPE TESTING
//~~~~~~~~~~~~~~~~~~~
describe('network string (using alchemy)', () => {
  const apiKey = process.env.ALCHEMY_APIKEY;
  const alcProvider = new ethers.providers.AlchemyProvider('homestead', apiKey);
  it('should return mainnet state address with network string given. using alchemy api', async () => {
    expect(await getStateAddress(alcProvider)).toEqual(mainnetAddy);
  })
})

describe('network chainid (using alchemy)', () => {
  const apiKey = process.env.ALCHEMY_APIKEY;
  const alcProvider = new ethers.providers.AlchemyProvider(1, apiKey);
  it('should return mainnet state address with network chainid given. using alchemy api', async () => {
    expect(await getStateAddress(alcProvider)).toEqual(mainnetAddy);
  })
})

describe('network object (using alchemy)', () => {
  const apiKey = process.env.ALCHEMY_APIKEY;
  const networkObj = ethers.providers.getNetwork('homestead');
  const alcProvider = new ethers.providers.AlchemyProvider(networkObj, apiKey);
  it('should return mainnet state address with network object given. using alchemy api', async () => {
    expect(await getStateAddress(alcProvider)).toEqual(mainnetAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// ALCHEMY
//~~~~~~~~~~~~~~~~~~~
describe('alchemy mainnet', () => {
  const apiKey = process.env.ALCHEMY_APIKEY;
  const alcProvider = new ethers.providers.AlchemyProvider('homestead', apiKey);
  it('should return mainnet state address with alchemy provider given', async () => {
    expect(await getStateAddress(alcProvider)).toEqual(mainnetAddy);
  })
})

describe('alchemy kovan', () => {
  const apiKey = process.env.ALCHEMY_APIKEY_KOVAN;
  const alcProvider = new ethers.providers.AlchemyProvider('kovan', apiKey);
  it('should return kovan state address with alchemy provider given', async () => {
    expect(await getStateAddress(alcProvider, 'kovan')).toEqual(kovanAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// INFURA
//~~~~~~~~~~~~~~~~~~~
describe('infura mainnet', () => {
  const apiKey = process.env.INFURA_APIKEY;
  const infuraProvider = new ethers.providers.InfuraProvider('homestead', apiKey);
  it('should return mainnet state address with infura provider given', async () => {
    expect(await getStateAddress(infuraProvider)).toEqual(mainnetAddy);
  })
})

describe('infura kovan', () => {
  const infuraProvider = new ethers.providers.InfuraProvider('kovan');
  it('should return kovan state address with infura provider given', async () => {
    expect(await getStateAddress(infuraProvider)).toEqual(kovanAddy);
  })
})

describe('infura polygon', () => {
  const infuraProvider = new ethers.providers.InfuraProvider('matic');
  it('should return polygon state address with infura provider given', async () => {
    expect(await getStateAddress(infuraProvider)).toEqual(polygonAddy);
  })
})

describe('infura mumbai', () => {
  const infuraProvider = new ethers.providers.InfuraProvider('maticmum');
  it('should return mumbai state address with infura provider given', async () => {
    expect(await getStateAddress(infuraProvider)).toEqual(mumbaiAddy);
  })
})

//~~~~~~~~~~~~~~~~~~~
// ETHERSCAN
//~~~~~~~~~~~~~~~~~~~
describe('etherscan mainnet', () => {
  const etherscanProvider = new ethers.providers.EtherscanProvider();
  it('should return mainnet state address with etherscan provider given', async () => {
    expect(await getStateAddress(etherscanProvider)).toEqual(mainnetAddy);
  })
})

describe('etherscan kovan', () => {
  const etherscanProvider = new ethers.providers.EtherscanProvider('kovan');
  it('should return kovan state address with etherscan provider given', async () => {
    expect(await getStateAddress(etherscanProvider)).toEqual(kovanAddy);
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
    expect(await getStateAddress(ankrProvider)).toEqual(polygonAddy);
  })
})
