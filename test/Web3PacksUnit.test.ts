import 'dotenv/config';
import Charged from '../src/index';
import { getWallet } from '../src/utils/testUtilities';
import { contractMocks } from '../src/utils/testUtilities';
import { mumbaiAddresses } from '../src/index';

const { writeContractMock, readContractMock } = contractMocks(jest);

const providersKovan = [
  {
    network: 42,
    service: { 'alchemy': process.env.ALCHEMY_KOVAN_KEY }
  }
];

const walletAddress = '0x277bfc4a8dc79a9f194ad4a83468484046fafd3a';

const tokenAddress = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
const tokenId = '18';

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

  it('Should energize', async () => {
    const charged = new Charged({ providers: providersKovan, signer })
    const nft = charged.NFT(tokenAddress, tokenId);

    const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
    const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    const addressListToBeReleased = {
      erc20TokenAddresses: [
        daiAddress,
        usdcAddress
      ]
    }
    const tx = await nft.multiRelease(walletAddress, 'generic.B', addressListToBeReleased);
    const receipt = await tx.wait();

    expect(receipt).toBe(true);
    expect(writeContractMock.mock.calls[0][0]).toBe('web3pack');
    expect(writeContractMock.mock.calls[0][1]).toBe('unbundle');
    expect(writeContractMock.mock.calls[0][2]).toBe(42);
    expect(writeContractMock.mock.calls[0][3]).toEqual([
      walletAddress,
      tokenAddress,
      tokenId,
      addressListToBeReleased
    ]);
  });

  it ('Gets mumbai address from the graph repo', async() => {
    expect(mumbaiAddresses.web3pack.address).toEqual('0x70a7336371C0f0e064Bf2BA0B5e9682C20B3ebca');
  });
});

