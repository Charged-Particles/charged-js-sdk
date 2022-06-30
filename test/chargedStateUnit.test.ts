import 'dotenv/config';
import Charged from '../src/charged/index';
import { getWallet } from '../src/utils/testUtilities';
import { contractMocks } from '../src/utils/testUtilities';

const { readContractMock, writeContractMock } = contractMocks(jest);

const signer = getWallet();
const providersKovan = [
  {
    network: 42,
    service: { 'alchemy': process.env.ALCHEMY_KOVAN_KEY }
  }
];
const expectedUnlockBlockNumber = 32174859;
const walletAddress = '0x277bfc4a8dc79a9f194ad4a83468484046fafd3a';
const tokenAddress = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
const tokenId = 78;

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  writeContractMock.mockClear();
  readContractMock.mockClear();
});

describe('ChargedState contract test', () => {
  const charged = new Charged({ providers: providersKovan, signer });
  const nft = charged.NFT(tokenAddress, tokenId);

  it('Set release timelock', async () => {
    const tx = await nft.releaseTimelock(expectedUnlockBlockNumber);
    const receipt = await tx.wait();
    expect(receipt).toEqual(true);

    expect(writeContractMock.mock.calls[0][0]).toBe('chargedState');
    expect(writeContractMock.mock.calls[0][1]).toBe('setReleaseTimelock');
    expect(writeContractMock.mock.calls[0][2]).toBe(42);
    expect(writeContractMock.mock.calls[0][3]).toEqual([
      tokenAddress,
      tokenId,
      expectedUnlockBlockNumber
    ]);
  });

  it('Get release timelock', async () => {
    const releaseState = await nft.getReleaseState(walletAddress);
    expect(releaseState['42'].value).toEqual('success');

    expect(readContractMock.mock.calls[0][0]).toBe('chargedState');
    expect(readContractMock.mock.calls[0][1]).toBe('getReleaseState');
    expect(readContractMock.mock.calls[0][2]).toBe(42);
    expect(readContractMock.mock.calls[0][3]).toEqual([
      tokenAddress,
      tokenId,
      walletAddress
    ]);
  });

  it('Set discharge timelock', async () => {
    const tx = await nft.dischargeTimelock(expectedUnlockBlockNumber);
    const receipt = await tx.wait();
    expect(receipt).toEqual(true);

    expect(writeContractMock.mock.calls[0][0]).toBe('chargedState');
    expect(writeContractMock.mock.calls[0][1]).toBe('setDischargeTimelock');
    expect(writeContractMock.mock.calls[0][2]).toBe(42);
    expect(writeContractMock.mock.calls[0][3]).toEqual([
      tokenAddress,
      tokenId,
      expectedUnlockBlockNumber
    ]);
  });

  it('Set get discharge timelock', async () => {
    const dischargeState = await nft.getDischargeState(walletAddress);
    expect(dischargeState['42'].value).toEqual('success');

    expect(readContractMock.mock.calls[0][0]).toBe('chargedState');
    expect(readContractMock.mock.calls[0][1]).toBe('getDischargeState');
    expect(readContractMock.mock.calls[0][2]).toBe(42);
    expect(readContractMock.mock.calls[0][3]).toEqual([
      tokenAddress,
      tokenId,
      walletAddress
    ]);
  });

  it('Set bonds timelock', async () => {
    const tx = await nft.bondsTimelock(expectedUnlockBlockNumber);
    const receipt = await tx.wait();
    expect(receipt).toEqual(true);

    expect(writeContractMock.mock.calls[0][0]).toBe('chargedState');
    expect(writeContractMock.mock.calls[0][1]).toBe('setBreakBondTimelock');
    expect(writeContractMock.mock.calls[0][2]).toBe(42);
    expect(writeContractMock.mock.calls[0][3]).toEqual([
      tokenAddress,
      tokenId,
      expectedUnlockBlockNumber
    ]);
  });

  it('Get bonds timelock', async () => {
    const bondsState = await nft.getBondsState(walletAddress);

    expect(bondsState['42'].value).toEqual('success');

    expect(readContractMock.mock.calls[0][0]).toBe('chargedState');
    expect(readContractMock.mock.calls[0][1]).toBe('getBreakBondState');
    expect(readContractMock.mock.calls[0][2]).toBe(42);
    expect(readContractMock.mock.calls[0][3]).toEqual([
      tokenAddress,
      tokenId,
      walletAddress
    ]);
  });

  it.only('Set signer after Charged init', async () => {
    const charged = new Charged({ providers: providersKovan });
    
    expect(charged).toHaveProperty('state.signer', undefined);

    charged.setSigner(signer);

    console.log(charged.state.signer);
  });

});
