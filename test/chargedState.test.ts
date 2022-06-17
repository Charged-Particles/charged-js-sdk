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
]
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
    const result = await nft.releaseTimelock(expectedUnlockBlockNumber);
    expect(result).toEqual(true);
  });

  it('Get release timelock', async () => {
    const releaseState = await nft.getReleaseState(walletAddress);
    expect(releaseState['42'].value).toEqual('success');
  });

  it('Set discharge timelock', async () => {
    const result = await nft.dischargeTimelock(expectedUnlockBlockNumber);
    expect(result).toEqual(true);
  });

  it('Set get discharge timelock', async () => {
    const dischargeState = await nft.getDischargeState(walletAddress);
    expect(dischargeState['42'].value).toEqual('success');
  });

  it('Set bonds timelock', async () => {
    const result = await nft.bondsTimelock(expectedUnlockBlockNumber);
    expect(result).toEqual(true);
  });

  it('Get bonds timelock', async () => {
    const bondsState = await nft.getBondsState(walletAddress);
    expect(bondsState['42'].value).toEqual('success');
  });
});
