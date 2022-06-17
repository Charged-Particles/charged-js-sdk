import 'dotenv/config';
import Charged from '../src/index';
import BaseService from '../src/charged/services/baseService';
import { ethers } from 'ethers';
import { getWallet } from '../src/utils/testUtilities';

const writeContractMock = jest
  .spyOn(BaseService.prototype, 'writeContract')
  .mockImplementation((contractName, methodName, network) => {
    if (!contractName || !methodName || !network) { Promise.reject('missing required parameters') }
    return (Promise.resolve({ wait: () => true }));
  });

const readContractMock = jest
  .spyOn(BaseService.prototype, 'readContract')
  .mockImplementation((contractName, methodName, network) => {
    if (!contractName || !methodName || !network) { Promise.reject('missing required parameters') }

    return (Promise.resolve('success'));
  });

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
  });

  it('should energize', async () => {
    const charged = new Charged({ providers: providersKovan, signer })
    const nft = charged.NFT(tokenAddress, tokenId);

    const result = await nft.energize('aave.B', ENJCoin, ethers.utils.parseEther("47"));

    expect(result).toBe(true);
  });
});
