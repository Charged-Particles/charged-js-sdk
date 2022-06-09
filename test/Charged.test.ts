import { rpcUrlMainnet } from '../src/utils/config';
import { getWallet } from '../src/utils/testUtilities';
import { BigNumber, ethers } from 'ethers';
const Web3HttpProvider = require('web3-providers-http');

import Charged from '../src/Charged';

describe('Charged class', () => {
  const myWallet = getWallet();
  const providers = [
    {
      network: 1,
      service: { 'alchemy': process.env.ALCHEMY_MAINNET_KEY }
    },
    {
      network: 42,
      service: { 'alchemy': process.env.ALCHEMY_KOVAN_KEY }
    }
  ]

  it('Initializes charged SDK', async () => {
    const charged = new Charged({ providers })
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('1');
    expect(allStateAddresses).toHaveProperty('42');

    console.log(allStateAddresses);
  });

  it('Initializes NFT service', async () => {
    const charged = new Charged({ providers });

    const particleBAddress = '0x04d572734006788B646ce35b133Bdf7160f79995';
    const tokenId = 4;
    // const network = 1;

    const nft = charged.NFT(particleBAddress, tokenId);

    expect(nft.contractAddress).toEqual(particleBAddress);
    expect(nft.tokenId).toEqual(tokenId);

    const tokenURI = await nft.tokenURI()

    expect(tokenURI).toEqual({
      "1": { value: "https://ipfs.infura.io/ipfs/QmT5ZjLAZevefv3CMiLAD1p1CeoTSc6EWbGY8EmzXaFt85", status: 'fulfilled' },
    });
  });

  it('Initializes charged with default providers', async () => {
    const charged = new Charged();

    const providers = charged.providers;

    expect(providers).toHaveProperty('1');
    expect(providers).toHaveProperty('42');

    const stateAddresses = await charged.utils.getStateAddress();

    expect(stateAddresses).toHaveProperty('1', { "status": "fulfilled", "value": "0x48974C6ae5A0A25565b0096cE3c81395f604140f" });
    expect(stateAddresses).toHaveProperty('42', { "status": "fulfilled", "value": "0x121da37d04D1405d96cFEa65F79Eaa095C2582Ca" });
  });

  it('energize a test particle', async () => {
    const charged = new Charged({ providers, signer: myWallet });

    const particleBAddress = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
    const tokenId = 43;
    const network = 42;

    const nft = charged.NFT(particleBAddress, tokenId);
    const receipt = await nft.energize(
      'aave.B',
      '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
      BigNumber.from(10),
      network
    );

    console.log({ receipt }); // TODO: expect !
  });

  it('Initializes with ether.js external provider', async () => {
    const externalProvider = ethers.getDefaultProvider(1, { 'alchemy': 'qw02QqWNMg2kby3q3N39PxUT3KaRS5UE' });
    const charged = new Charged({ providers: externalProvider });
    const stateAddresses = await charged.utils.getStateAddress();

    expect(stateAddresses).toHaveProperty('1', { "status": "fulfilled", "value": "0x48974C6ae5A0A25565b0096cE3c81395f604140f" });
  });

  it('Initializes with Web3 external provider', async () => {
    const externalWeb3Provider = new Web3HttpProvider(rpcUrlMainnet);
    const charged = new Charged({ providers: externalWeb3Provider });
    const stateAddresses = await charged.utils.getStateAddress();

    expect(stateAddresses).toHaveProperty('1', { "status": "fulfilled", "value": "0x48974C6ae5A0A25565b0096cE3c81395f604140f" });
  });

  it.only('Should fetch from Mumbai Alchemy', async () => {
    const mumbaiProvider = [{ network: 80001, service: {alchemy: process.env.ALCHEMY_MUMBAI_KEY}}];
    const charged = new Charged({providers: mumbaiProvider})
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('80001', { "status": "fulfilled", "value": "0x581c57b86fC8c2D639f88276478324cE1380979D" });
  });

  it.only('Should fetch from Polygon Alchemy', async () => {
    const polygonProvider = [{ network: 137, service: {alchemy: process.env.ALCHEMY_POLYGON_KEY}}];
    const charged = new Charged({providers: polygonProvider})
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('137', { "status": "fulfilled", "value": "0x9c00b8CF03f58c0420CDb6DE72E27Bf11964025b" });
  });

  // KOVAN is deprecated via alchemy !!! whoops
  // it.only('Should fetch from Kovan Alchemy', async () => {
  //   const kovanProvider = [{ network: 42, service: {alchemy: process.env.ALCHEMY_KOVAN_KEY}}];
  //   const charged = new Charged({providers: kovanProvider})
  //   const allStateAddresses = await charged.utils.getStateAddress();

  //   expect(allStateAddresses).toHaveProperty('42', { "status": "fulfilled", "value": "0x121da37d04D1405d96cFEa65F79Eaa095C2582Ca" });
  // });

  it.only('Should fetch from Mainnet Alchemy', async () => {
    const mainnetProvider = [{ network: 1, service: {alchemy: process.env.ALCHEMY_MAINNET_KEY}}];
    const charged = new Charged({providers: mainnetProvider})
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('1', { "status": "fulfilled", "value": "0x48974C6ae5A0A25565b0096cE3c81395f604140f" });
  });

  // INFURA_PROJECT_SECRET used for all four network tests below:

  it.only('Should fetch from Mumbai Infura', async () => {
    const mumbaiProvider = [{ network: 80001, service: {infura: process.env.INFURA_PROJECT_SECRET}}];
    const charged = new Charged({providers: mumbaiProvider})
    const allStateAddresses = await charged.utils.getStateAddress();

    console.log({allStateAddresses});

    expect(allStateAddresses).toHaveProperty('80001', { "status": "fulfilled", "value": "0x581c57b86fC8c2D639f88276478324cE1380979D" });
  });

  it.only('Should fetch from Polygon Infura', async () => {
    const polygonProvider = [{ network: 137, service: {infura: process.env.INFURA_PROJECT_SECRET}}];
    const charged = new Charged({providers: polygonProvider})
    const allStateAddresses = await charged.utils.getStateAddress();

    console.log({allStateAddresses});

    expect(allStateAddresses).toHaveProperty('137', { "status": "fulfilled", "value": "0x9c00b8CF03f58c0420CDb6DE72E27Bf11964025b" });
  });

  it.only('Should fetch from Kovan Infura', async () => {
    const kovanProvider = [{ network: 42, service: {infura: process.env.INFURA_PROJECT_SECRET}}];
    const charged = new Charged({providers: kovanProvider})
    const allStateAddresses = await charged.utils.getStateAddress();

    console.log({allStateAddresses});

    expect(allStateAddresses).toHaveProperty('42', { "status": "fulfilled", "value": "0x121da37d04D1405d96cFEa65F79Eaa095C2582Ca" });
  });

  it.only('Should fetch from Mainnet Infura', async () => {
    const mainnetProvider = [{ network: 1, service: {infura: process.env.INFURA_PROJECT_SECRET}}];
    const charged = new Charged({providers: mainnetProvider})
    const allStateAddresses = await charged.utils.getStateAddress();

    console.log({allStateAddresses});

    expect(allStateAddresses).toHaveProperty('1', { "status": "fulfilled", "value": "0x48974C6ae5A0A25565b0096cE3c81395f604140f" });
  });

})
