/**
 * @jest-environment hardhat
 */
const { ethers } = require("hardhat");
const Web3HttpProvider = require('web3-providers-http');

import erc20Abi from '../abi/erc20.json';
import {
  rpcUrlMainnet,
  infuraProjectId,
  alchemyMainnetKey,
  alchemyMumbaiKey,
  alchemyKovanKey,
  alchemyPolygonKey
} from '../../src/utils/config';
import { chargedParticlesAbi, protonBAbi, mainnetAddresses } from '../../src/index';
import { getWallet } from '../../src/utils/testUtilities';
import { BigNumber } from 'ethers';
import Charged from '../../src/charged/index';

const localTestNetRpcUrl = 'http://localhost:8545';
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
    network: 1,
    service: { 'rpc': localTestNetRpcUrl }
  }
];

const particleBAddress = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
const daiMainnetAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
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
    const state = charged.getState();
    const providers = state.providers;

    expect(providers).toHaveProperty('1');
    expect(providers).toHaveProperty('42');

    const stateAddresses = await charged.utils.getStateAddress();

    expect(stateAddresses).toHaveProperty('1', { "status": "fulfilled", "value": "0x48974C6ae5A0A25565b0096cE3c81395f604140f" });
    expect(stateAddresses).toHaveProperty('42', { "status": "fulfilled", "value": "0x121da37d04D1405d96cFEa65F79Eaa095C2582Ca" });
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
        '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
        BigNumber.from(10),
        'aave.B',
        network
      );
    }).rejects.toThrow('Trying to write with no signer');
  });

  it('Default setting turns bridge nft check off', async () => {
    const charged = new Charged({ providers: localProvider });
    const nft = charged.NFT(particleBAddress, tokenId);

    const state = charged.getState(); 
    expect(state).toHaveProperty('configuration.sdk.NftBridgeCheck', false);

    const NoNftBridgeCheck = await nft.bridgeNFTCheck(42);
    expect(NoNftBridgeCheck).toBeUndefined();
  });

  it('Bridge NFT check setting to true', async () => {
    const userSetting = { sdk: { NftBridgeCheck: true } }
    const charged = new Charged({ providers: localProvider, config: userSetting });

    const state = charged.getState(); 
    expect(state).toHaveProperty('configuration.sdk.NftBridgeCheck', true);
  });

  it('should create a contract from exported abis', async () => {
    const provider = new ethers.providers.JsonRpcProvider(localTestNetRpcUrl, ganacheChainId);
    const contract = new ethers.Contract(
      mainnetAddresses.chargedParticles.address,
      chargedParticlesAbi,
      provider
    );
    expect(await contract.getStateAddress()).toEqual(mainnetAddresses.chargedState.address);
  });

  it('Bond an erc721 into protonB.', async () => {
    const charged = new Charged({ providers: ethers.provider, signer: myWallet });

    const nft = charged.NFT(mainnetAddresses.protonB.address, 1);

    const bondCountBeforeDeposit = await nft.getBonds('generic.B');
    const bondCountBeforeDepositValue = bondCountBeforeDeposit[1].value;
    expect(bondCountBeforeDepositValue.toNumber()).toEqual(0);

    // Mint proton
    const erc721Contract = new ethers.Contract(mainnetAddresses.protonB.address, protonBAbi, ethers.provider.getSigner());
    const protonId = await erc721Contract.callStatic.createBasicProton(
      myWallet.address,
      myWallet.address,
      'tokenUri.com',
    );

    const txCreateProton = await erc721Contract.createBasicProton(
      myWallet.address,
      myWallet.address,
      'tokenUri.com',
    );
    await txCreateProton.wait();
    
    const txApprove = await erc721Contract.approve(mainnetAddresses.chargedParticles.address, protonId.toString());
    await txApprove.wait();
    
    // Create bond
    const txBond = await nft.bond(
      mainnetAddresses.protonB.address,
      protonId,
      '1',
    );
    const txBondReceipt = await txBond.wait();
    expect(txBondReceipt).toHaveProperty('transactionHash');
    const bondCountAfterDeposit = await nft.getBonds('generic.B');
    const bondCountAfterDepositValue = bondCountAfterDeposit[1].value;
    expect(bondCountAfterDepositValue.toNumber()).toEqual(1);
  });

  it.only('Breaks a proton bond', async () => {
    const impersonatedAddress = '0x6dA0a1784De1aBDDe1734bA37eCa3d560bf044c0';
    const impersonatedSigner = await ethers.getImpersonatedSigner(impersonatedAddress);

    const erc721Contract = new ethers.Contract(mainnetAddresses.proton.address, protonBAbi, impersonatedSigner);
    const txTransfer = await erc721Contract.transferFrom(
      impersonatedAddress,
      myWallet.address,
      '458'
    );

    await txTransfer.wait();
    const ownerOf = await erc721Contract.ownerOf('458');
    expect(ownerOf).toBe(myWallet.address);

    const charged = new Charged({ providers: ethers.provider, signer: myWallet });
    const nft = charged.NFT(mainnetAddresses.proton.address, 458);
  
    const bondBalanceBeforeBreak = await nft.getBonds('generic');
    expect(bondBalanceBeforeBreak[1].value).toEqual(ethers.BigNumber.from(2));

    const breakBondTrx = await nft.breakBond(
      myWallet.address,
      '0x60f80121c31a0d46b5279700f9df786054aa5ee5',
      '1095782',
      1,
      'generic',
      1
    );

    await breakBondTrx.wait();
    const bondBalanceAfterBreak = await nft.getBonds('generic');
    expect(bondBalanceAfterBreak[1].value).toEqual(ethers.BigNumber.from(1));
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
      '0x8bcbeea783c9291f0d5949143bbefc8bf235300c',
      '4',
      amountToRemove,
    );
    const receipt = await breakBondTrx.wait();

    expect(receipt).toHaveProperty('transactionHash');

    const bondCountAfterBreak = await nft.getBonds('generic.B');
    const bondCountAfterBreakValue = bondCountAfterBreak[42].value;
    expect(bondCountAfterBreakValue).toEqual(bondCountBeforeBreakValue.sub(amountToRemove));

    const bondTrx = await nft.bond(
      '0x8bcbeea783c9291f0d5949143bbefc8bf235300c',
      '4',
      1,
    );
    const bondReceipt = await bondTrx.wait();

    expect(bondReceipt).toHaveProperty('transactionHash');
    const bondCountAfterBond = await nft.getBonds('generic.B');
    const bondCountAfterBondValue = bondCountAfterBond[42].value;
    expect(bondCountAfterBondValue).toEqual(bondCountAfterBreakValue.add(1));
  });

  it('energize a test particle', async () => {
    // Found test address with DAI
    const testAddress = myWallet.address; 
    const impersonatedAddress = '0x31d3243CfB54B34Fc9C73e1CB1137124bD6B13E1';

    const impersonatedSigner = await ethers.getImpersonatedSigner(impersonatedAddress);
    const erc20Contract = new ethers.Contract(daiMainnetAddress, erc20Abi, impersonatedSigner);

    const whaleBalanceBeforeTransfer = await erc20Contract.balanceOf(impersonatedAddress);
    expect(whaleBalanceBeforeTransfer).toEqual(ethers.BigNumber.from('15552713517234070012390106'));

    const txTransfer = await erc20Contract.transfer(testAddress, 10);
    await txTransfer.wait();
    
    const txApprove = await erc20Contract.connect(ethers.provider.getSigner()).approve(mainnetAddresses.chargedParticles.address, 10);
    await txApprove.wait();

    const txAllowance = await erc20Contract.allowance(testAddress, mainnetAddresses.chargedParticles.address);
    expect(txAllowance).toEqual(ethers.BigNumber.from('10'));

    const testAddressBalanceAfterTransfer = await erc20Contract.balanceOf(testAddress);
    expect(testAddressBalanceAfterTransfer).toEqual(ethers.BigNumber.from('10'));

    const charged = new Charged({ providers: ethers.provider, signer: myWallet });

    const particleBAddress = mainnetAddresses.protonB.address;
    const tokenId = 1;
    const nft = charged.NFT(particleBAddress, tokenId);

    const txEnergize = await nft.energize(
      daiMainnetAddress,
      BigNumber.from(1),
      'aave.B',
    );
    const txEnergizeReceipt = await txEnergize.wait();
    expect(txEnergizeReceipt).toHaveProperty('status', 1);

    const energizeStatus = await nft.getMass(daiMainnetAddress, 'aave.B');
    expect(energizeStatus).toHaveProperty('1.value', ethers.BigNumber.from(1))
  });
});
