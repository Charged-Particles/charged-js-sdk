import 'dotenv/config';
import Charged from '../src/index';
import BaseService from '../src/charged/services/baseService';
import { ethers } from 'ethers';
import { chargedParticlesAbi, mainnetAddresses } from '../src/index';
import { getWallet }  from '../src/utils/testUtilities';

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
const providers = [
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

const address = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
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

    const charged = new Charged({ providers });

    const stateAddys = await charged.utils.getStateAddress();
    const managersAddys = await charged.utils.getManagersAddress();
    const settingsAddys = await charged.utils.getSettingsAddress();

    expect(stateAddys).toHaveProperty('1.value', 'success');
    expect(managersAddys).toHaveProperty('1.value', 'success');
    expect(settingsAddys).toHaveProperty('1.value', 'success');
    expect(stateAddys).toHaveProperty('42.value', 'success');
    expect(managersAddys).toHaveProperty('42.value', 'success');
    expect(settingsAddys).toHaveProperty('42.value', 'success');

    expect(readContractMock).toHaveBeenCalledTimes(6);
  });

  it('should release 47 ENJ tokens', async () => {
    // ignoring .env type checking
    const charged = new Charged({ providers: providersKovan, signer })

    const nft = charged.NFT(address, tokenId);
    const result = await nft.releaseAmount(walletAddress, 'aave.B', ENJCoin, ethers.utils.parseEther("47"));

    expect(result).toBe(true);
    expect(writeContractMock).toHaveBeenCalled();
  })

  it.only('should discharge', async () => {
    const charged = new Charged({ providers: providersKovan, signer })
    const nft = charged.NFT(address, tokenId);
    const result = await nft.discharge(walletAddress, 'aave.B', ENJCoin);

    expect(result).toBe(true);
  })

  it('should get mass, charge, and # of bonds of a proton', async () => {
    const charged = new Charged({ providers: providersKovan, signer })

    const nft = charged.NFT(address, tokenId);
    const massBN = await nft.getMass('aave.B', '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2');
    const chargeBN = await nft.getCharge('aave.B', '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2');
    const bondsBN = await nft.getBonds('generic.B');
    const mass = ethers.utils.formatUnits(massBN['42'].value);
    const charge = ethers.utils.formatUnits(chargeBN['42'].value);
    const bonds = bondsBN['42'].value.toNumber();

    expect(Number(mass)).toBeGreaterThan(1);
    // This value could be out of date. Check https://staging.app.charged.fi/go/energize/0xd1bce91a13089b1f3178487ab8d0d2ae191c1963/18
    expect(Number(charge)).toBeCloseTo(0);
    expect(Number(bonds)).toEqual(3);
  });

  it('should energize', async () => {
    // ignoring .env type checking
    // @ts-ignore
    const charged = new Charged({ providers: providersKovan, signer })

    const nft = charged.NFT(address, tokenId);
    const result = await nft.energize('aave.B', ENJCoin, ethers.utils.parseEther("47"));

    // TODO: Expect something with the response?
    expect(result).toHaveProperty('confirmations');
  });

  it('should create a contract from exported abis', async () => {
    const contract = new ethers.Contract(
      mainnetAddresses.chargedParticles.address,
      chargedParticlesAbi,
      ethers.getDefaultProvider()
    )
    expect(await contract.getStateAddress()).toEqual(mainnetAddresses.chargedState.address);
  });

});
