import {
  rpcUrlMainnet,
  infuraProjectId,
  alchemyMainnetKey,
  alchemyMumbaiKey,
  alchemyKovanKey,
  alchemyPolygonKey
} from '../../src/utils/config';

import Charged from '../../src/charged/index';
import { getWallet } from '../../src/utils/testUtilities';
import { BigNumber, ethers } from 'ethers';
import { chargedParticlesAbi, kovanAddresses } from '../../src/index';
const Web3HttpProvider = require('web3-providers-http');

const localTestNetRpcUrl = 'http://127.0.0.1:8545/';
const myWallet = getWallet();
const providers = [
  {
    network: 1,
    service: { 'alchemy': alchemyMainnetKey }
  },
  {
    network: 42,
    service: { 'alchemy': alchemyMumbaiKey }
  }
];
const localProvider = [
  {
    network: 42,
    service: { 'rpc': localTestNetRpcUrl }
  }
];

const particleBAddress = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
const tokenId = 43;
const network = 42;
const ganacheChainId = 1337;

describe('Charged class', () => {

  it('Initializes charged SDK', async () => {
    const charged = new Charged({ providers })
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('1');
    expect(allStateAddresses).toHaveProperty('42');
  });

  it('Initializes NFT service', async () => {
    const charged = new Charged({ providers });

    const particleBAddress = '0x04d572734006788B646ce35b133Bdf7160f79995';
    const tokenId = 4;

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
    const providers = charged.state.providers;

    expect(providers).toHaveProperty('1');
    expect(providers).toHaveProperty('42');

    const stateAddresses = await charged.utils.getStateAddress();

    expect(stateAddresses).toHaveProperty('1', { "status": "fulfilled", "value": "0x48974C6ae5A0A25565b0096cE3c81395f604140f" });
    expect(stateAddresses).toHaveProperty('42', { "status": "fulfilled", "value": "0x121da37d04D1405d96cFEa65F79Eaa095C2582Ca" });
  });

  it('energize a test particle', async () => {
    const charged = new Charged({ providers: localProvider, signer: myWallet });

    const particleBAddress = kovanAddresses.protonB.address;
    const tokenId = 43;
    const network = 42;

    const nft = charged.NFT(particleBAddress, tokenId);
    const receipt = await nft.energize(
      'aave.B',
      '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
      BigNumber.from(10),
      network
    );

    expect(receipt).toHaveProperty('status', 1)
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

  it('Throws when Charged class is passed a not supported parameter', () => {
    expect(() => {
      //@ts-ignore
      new Charged({ externalProvider: providers });
    }).toThrow('externalProvider is not a valid parameter');
  });

  it('Should fetch from Mumbai Alchemy using API key', async () => {
    const mumbaiProvider = [{ network: 80001, service: { alchemy: alchemyMumbaiKey } }];
    const charged = new Charged({ providers: mumbaiProvider })
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('80001', { "status": "fulfilled", "value": "0x581c57b86fC8c2D639f88276478324cE1380979D" });
  });

  it('Should fetch from Polygon Alchemy using API key', async () => {
    const polygonProvider = [{ network: 137, service: { alchemy: alchemyPolygonKey } }];
    const charged = new Charged({ providers: polygonProvider })
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('137', { "status": "fulfilled", "value": "0x9c00b8CF03f58c0420CDb6DE72E27Bf11964025b" });
  });

  // KOVAN is deprecated via alchemy !!! whoops
  it('Should fetch from Kovan Alchemy using API key', async () => {
    const kovanProvider = [{ network: 42, service: { alchemy: alchemyKovanKey } }];
    const charged = new Charged({ providers: kovanProvider })
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('42', { "status": "fulfilled", "value": "0x121da37d04D1405d96cFEa65F79Eaa095C2582Ca" });
  });

  it('Should fetch from Mainnet Alchemy using API key', async () => {
    const mainnetProvider = [{ network: 1, service: { alchemy: alchemyMainnetKey } }];
    const charged = new Charged({ providers: mainnetProvider })
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('1', { "status": "fulfilled", "value": "0x48974C6ae5A0A25565b0096cE3c81395f604140f" });
  });

  // INFURA_PROJECT_ID used for all four network tests below:
  it.skip('Should fetch from Mumbai Infura using project secret', async () => {
    const mumbaiProvider = [{ network: 80001, service: { infura: infuraProjectId } }];
    const charged = new Charged({ providers: mumbaiProvider });
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('80001', { "status": "fulfilled", "value": "0x581c57b86fC8c2D639f88276478324cE1380979D" });
  });

  it.skip('Should fetch from Polygon Infura using project secret', async () => {
    const polygonProvider = [{ network: 137, service: { infura: infuraProjectId } }];
    const charged = new Charged({ providers: polygonProvider })
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('137', { "status": "fulfilled", "value": "0x9c00b8CF03f58c0420CDb6DE72E27Bf11964025b" });
  });

  it('Should fetch from Kovan Infura using project secret', async () => {
    const kovanProvider = [{ network: 42, service: { infura: infuraProjectId } }];
    const charged = new Charged({ providers: kovanProvider })
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('42', { "status": "fulfilled", "value": "0x121da37d04D1405d96cFEa65F79Eaa095C2582Ca" });
  });

  it('Should fetch from Mainnet Infura using project secret', async () => {
    const mainnetProvider = [{ network: 1, service: { infura: infuraProjectId } }];
    const charged = new Charged({ providers: mainnetProvider })
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('1', { "status": "fulfilled", "value": "0x48974C6ae5A0A25565b0096cE3c81395f604140f" });
  });

  it('Should fetch from Kovan Infura using rpc url', async () => {
    const kovanRpcUrlProvider = [
      {
        network: 42,
        service: { 'rpc': `https://kovan.infura.io/v3/${infuraProjectId}` }
      }
    ];

    const charged = new Charged({ providers: kovanRpcUrlProvider })
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('42', { "status": "fulfilled", "value": "0x121da37d04D1405d96cFEa65F79Eaa095C2582Ca" });
  });

  it('Should fetch from Mainnet Alchemy using rpc url', async () => {
    const mainnetRpcUrlProvider = [
      {
        network: 1,
        service: { 'rpc': `https://eth-mainnet.alchemyapi.io/v2/${alchemyMainnetKey}` }
      }
    ];

    const charged = new Charged({ providers: mainnetRpcUrlProvider })
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('1', { "status": "fulfilled", "value": "0x48974C6ae5A0A25565b0096cE3c81395f604140f" });
  });

  it('Should fetch from both Kovan Infura and Mainnet Alchemy using rpc urls', async () => {

    const providers = [
      {
        network: 1,
        service: { 'rpc': `https://eth-mainnet.alchemyapi.io/v2/${alchemyMainnetKey}` }
      },
      {
        network: 42,
        service: { 'rpc': `https://kovan.infura.io/v3/${infuraProjectId}` }
      }
    ];

    const charged = new Charged({ providers })
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('1', { "status": "fulfilled", "value": "0x48974C6ae5A0A25565b0096cE3c81395f604140f" });
    expect(allStateAddresses).toHaveProperty('42', { "status": "fulfilled", "value": "0x121da37d04D1405d96cFEa65F79Eaa095C2582Ca" });
  });

  it('Throws when writing with no signer', async () => {
    const charged = new Charged({ providers: localProvider });
    const nft = charged.NFT(particleBAddress, tokenId);

    await expect(async () => {
      await nft.energize(
        'aave.B',
        '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
        BigNumber.from(10),
        network
      );
    }).rejects.toThrow('Trying to write with no signer');
  });

  it('Default setting turns bridge nft check off', async () => {
    const charged = new Charged({ providers: localProvider });
    const nft = charged.NFT(particleBAddress, tokenId);

    expect(charged).toHaveProperty('state.configuration.sdk.NftBridgeCheck', false);
    const NoNftBridgeCheck = await nft.bridgeNFTCheck(42);
    expect(NoNftBridgeCheck).toBeUndefined();
  });

  it('Bridge NFT check setting to true', async () => {
    const userSetting = { sdk: { NftBridgeCheck: true } }
    const charged = new Charged({ providers: localProvider, config: userSetting });
    expect(charged).toHaveProperty('state.configuration.sdk.NftBridgeCheck', true);
  });

  it('should create a contract from exported abis', async () => {
    const provider = new ethers.providers.JsonRpcProvider(localTestNetRpcUrl, ganacheChainId);
    const contract = new ethers.Contract(
      kovanAddresses.chargedParticles.address,
      chargedParticlesAbi,
      provider
    );
    expect(await contract.getStateAddress()).toEqual(kovanAddresses.chargedState.address);
  });

  it('Bonds an erc721 into protonB.', async () => {
    const charged = new Charged({ providers: localProvider, signer: myWallet });

    const nft = charged.NFT('0xd1bce91a13089b1f3178487ab8d0d2ae191c1963', 1);

    const bondCountBeforeDeposit = await nft.getBonds('generic.B');
    const bondCountBeforeDepositValue = bondCountBeforeDeposit[42].value;
    expect(bondCountBeforeDepositValue.toNumber()).toEqual(0);

    const bondTrx = await nft.bond(
      'generic.B',
      '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963',
      '43',
      1,
    );

    expect(bondTrx).toHaveProperty('transactionHash');

    const bondCountAfterDeposit = await nft.getBonds('generic.B');
    const bondCountAfterDepositValue = bondCountAfterDeposit[42].value;
    expect(bondCountAfterDepositValue.toNumber()).toEqual(1);
  });

  it('Breaks a protonB bond', async () => {
    const charged = new Charged({ providers: localProvider, signer: myWallet });
    const nft = charged.NFT('0xd1bce91a13089b1f3178487ab8d0d2ae191c1963', 18);

    const bondCountBeforeBreak = await nft.getBonds('generic.B');
    const bondCountBeforeBreakValue = bondCountBeforeBreak[42].value;
    expect(bondCountBeforeBreakValue.toNumber()).toEqual(4);

    const breakBondTrx = await nft.breakBond(
      myWallet.address,
      'generic.B',
      '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963',
      '87',
      1,
    );

    expect(breakBondTrx).toHaveProperty('transactionHash');
    const bondCountAfterBreak = await nft.getBonds('generic.B');
    const bondCountAfterBreakValue = bondCountAfterBreak[42].value;
    expect(bondCountAfterBreakValue).toEqual(bondCountBeforeBreakValue.sub(1));
  });

  it('Breaks an 1155 bond from protonB and bond back', async () => {
    const amountToRemove = 2;
    const charged = new Charged({ providers: localProvider, signer: myWallet });
    const nft = charged.NFT('0xd1bce91a13089b1f3178487ab8d0d2ae191c1963', 49);

    const bondCountBeforeBreak = await nft.getBonds('generic.B');
    const bondCountBeforeBreakValue = bondCountBeforeBreak[42].value;
    console.log(bondCountBeforeBreakValue.toNumber());

    expect(bondCountBeforeBreakValue.toNumber()).toEqual(10);

    const breakBondTrx = await nft.breakBond(
      myWallet.address,
      'generic.B',
      '0x8bcbeea783c9291f0d5949143bbefc8bf235300c',
      '4',
      amountToRemove,
    );

    expect(breakBondTrx).toHaveProperty('transactionHash');

    const bondCountAfterBreak = await nft.getBonds('generic.B');
    const bondCountAfterBreakValue = bondCountAfterBreak[42].value;
    expect(bondCountAfterBreakValue).toEqual(bondCountBeforeBreakValue.sub(amountToRemove));

    const bondTrx = await nft.bond(
      'generic.B',
      '0x8bcbeea783c9291f0d5949143bbefc8bf235300c',
      '4',
      1,
    );

    expect(bondTrx).toHaveProperty('transactionHash');
    const bondCountAfterBond = await nft.getBonds('generic.B');
    const bondCountAfterBondValue = bondCountAfterBond[42].value;
    expect(bondCountAfterBondValue).toEqual(bondCountAfterBreakValue.add(1));
  });
});
