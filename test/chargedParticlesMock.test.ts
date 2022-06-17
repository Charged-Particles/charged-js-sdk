import 'dotenv/config';
import Charged from '../src/index';
import { ethers } from 'ethers';
import { getWallet } from '../src/utils/testUtilities';
import { contractMocks } from '../src/utils/testUtilities';

const { writeContractMock, readContractMock } = contractMocks(jest);

const providersKovan = [
  {
    network: 42,
    service: { 'alchemy': process.env.ALCHEMY_KOVAN_KEY }
  }
];
const multipleProviders = [
  {
    network: 1,
    service: { 'alchemy': process.env.ALCHEMY_MAINNET_KEY }
  },
  {
    network: 42,
    service: { 'alchemy': process.env.ALCHEMY_KOVAN_KEY }
  }
];

const ENJCoin = '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2';
const walletAddress = '0x277bfc4a8dc79a9f194ad4a83468484046fafd3a';

const tokenAddress = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
const tokenId = 18;

const signer = getWallet();

/*
This test uses the team test wallet's mnemonic
Also the alchemy keys as seen below
*/

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  writeContractMock.mockClear();
  readContractMock.mockClear();
});

describe('chargedParticles contract test', () => {

  it('get state, managers, and settings addresses correctly on multiple chains', async () => {

    const charged = new Charged({ providers: multipleProviders });

    const stateAddys = await charged.utils.getStateAddress();
    const managersAddys = await charged.utils.getManagersAddress();
    const settingsAddys = await charged.utils.getSettingsAddress();

    expect(stateAddys).toHaveProperty('1.value', 'success');
    expect(managersAddys).toHaveProperty('42.value', 'success');
    expect(settingsAddys).toHaveProperty('1.value', 'success');

    expect(readContractMock).toHaveBeenCalledTimes(6);

    expect(readContractMock.mock.calls[0][0]).toBe('chargedParticles');
    expect(readContractMock.mock.calls[0][1]).toBe('getStateAddress');
    expect(readContractMock.mock.calls[0][2]).toBe(1);
    expect(readContractMock.mock.calls[1][2]).toBe(42);
    expect(readContractMock.mock.calls[0][3]).toEqual([]);
  });

  it('should release 47 ENJ tokens', async () => {
    const charged = new Charged({ providers: providersKovan, signer })
    const nft = charged.NFT(tokenAddress, tokenId);
    const result = await nft.releaseAmount(walletAddress, 'aave.B', ENJCoin, ethers.utils.parseEther("47"));

    expect(result).toBe(true);
    expect(writeContractMock).toHaveBeenCalled();

    expect(writeContractMock.mock.calls[0][0]).toBe('chargedParticles');
    expect(writeContractMock.mock.calls[0][1]).toBe('releaseParticleAmount');
    expect(writeContractMock.mock.calls[0][2]).toBe(42);
    expect(writeContractMock.mock.calls[0][3]).toEqual([
      walletAddress,
      tokenAddress,
      tokenId,
      'aave.B',
      ENJCoin,
      ethers.utils.parseEther("47")
    ]);
  })

  it('should discharge', async () => {
    const charged = new Charged({ providers: providersKovan, signer })
    const nft = charged.NFT(tokenAddress, tokenId);
    const result = await nft.discharge(walletAddress, 'aave.B', ENJCoin);

    expect(result).toBe(true);

    expect(writeContractMock.mock.calls[0][0]).toBe('chargedParticles');
    expect(writeContractMock.mock.calls[0][1]).toBe('dischargeParticle');
    expect(writeContractMock.mock.calls[0][2]).toBe(42);
    expect(writeContractMock.mock.calls[0][3]).toEqual([
      walletAddress,
      tokenAddress,
      tokenId,
      'aave.B',
      ENJCoin,
    ]);
  })

  it('should get mass, charge, and # of bonds of a proton', async () => {
    const charged = new Charged({ providers: providersKovan, signer })
    const nft = charged.NFT(tokenAddress, tokenId);

    const mass = await nft.getMass('aave.B', '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2');
    const charge = await nft.getCharge('aave.B', '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2');
    const bonds = await nft.getBonds('generic.B');

    expect(mass).toHaveProperty('42.value', 'success');
    expect(charge).toHaveProperty('42.value', 'success');
    expect(bonds).toHaveProperty('42.value', 'success');

    expect(readContractMock).toHaveBeenCalledTimes(3);

    expect(readContractMock.mock.calls[0][1]).toBe('baseParticleMass');
    expect(readContractMock.mock.calls[0][0]).toBe('chargedParticles');
    expect(readContractMock.mock.calls[0][2]).toBe(42);
    expect(readContractMock.mock.calls[0][3]).toEqual([
      tokenAddress,
      tokenId,
      'aave.B',
      '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2'
    ]);

    expect(readContractMock.mock.calls[1][1]).toBe('currentParticleCharge');
    expect(readContractMock.mock.calls[1][3]).toEqual([
      tokenAddress,
      tokenId,
      'aave.B',
      '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2'
    ]);

    expect(readContractMock.mock.calls[2][1]).toBe('currentParticleCovalentBonds');
    expect(readContractMock.mock.calls[2][3]).toEqual([
      tokenAddress,
      tokenId,
      'generic.B'
    ]);
  });

  it('Should energize', async () => {
    const charged = new Charged({ providers: providersKovan, signer })
    const nft = charged.NFT(tokenAddress, tokenId);
    const result = await nft.energize('aave.B', ENJCoin, ethers.utils.parseEther("47"));

    expect(result).toBe(true);
    expect(writeContractMock.mock.calls[0][0]).toBe('chargedParticles');
    expect(writeContractMock.mock.calls[0][1]).toBe('energizeParticle');
    expect(writeContractMock.mock.calls[0][2]).toBe(42);
    expect(writeContractMock.mock.calls[0][3]).toEqual([
      tokenAddress,
      tokenId,
      'aave.B',
      '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2',
      ethers.utils.parseEther("47"),
      '0x0000000000000000000000000000000000000000'
    ]);
  });
});
