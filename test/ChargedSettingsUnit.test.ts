import 'dotenv/config';
import Charged from '../src/index';
import { getWallet, contractMocks } from '../src/utils/testUtilities';

/*
This test uses the team test wallet's mnemonic
Also the alchemy keys as seen below
*/
const signer = getWallet();
const providersKovan = [
  {
    network: 42,
    service: { 'alchemy': process.env.ALCHEMY_KOVAN_KEY }
  }
];
const creatorAddy = '0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A';
const tokenAddress = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
const tokenId = '85';

const {readContractMock, writeContractMock} = contractMocks(jest);

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  writeContractMock.mockClear();
  readContractMock.mockClear();
});

describe('chargedSettings contract test', () => {
  it('Update annuity percentage', async () => {
    const charged = new Charged({ providers: providersKovan, signer });
    const nft = charged.NFT(tokenAddress, tokenId);

    const annuitiesPercentage = '9700';
    const receiver = '0xFD424D0E0CD49D6AD8f08893CE0D53F8EAEB4213';
    const setAnnuitiesTx = await nft.setCreatorAnnuities(creatorAddy, annuitiesPercentage);
    const setAnnuitiesRedirectTx = await nft.setCreatorAnnuitiesRedirect(receiver);
    const setAnnuitiesReceipt = await setAnnuitiesTx.wait();
    const setAnnuitiesRedirectReceipt = await setAnnuitiesRedirectTx.wait();

    expect(setAnnuitiesReceipt).toBe(true);
    expect(setAnnuitiesRedirectReceipt).toBe(true);

    expect(writeContractMock.mock.calls[0][0]).toBe('chargedSettings');
    expect(writeContractMock.mock.calls[0][1]).toBe('setCreatorAnnuities');
    expect(writeContractMock.mock.calls[0][2]).toBe(42);
    expect(writeContractMock.mock.calls[0][3]).toEqual([
      tokenAddress,
      tokenId,
      creatorAddy,
      annuitiesPercentage
    ]);

    expect(writeContractMock.mock.calls[1][0]).toBe('chargedSettings');
    expect(writeContractMock.mock.calls[1][1]).toBe('setCreatorAnnuitiesRedirect');
    expect(writeContractMock.mock.calls[1][2]).toBe(42);
    expect(writeContractMock.mock.calls[1][3]).toEqual([
      tokenAddress,
      tokenId,
      receiver
    ]);
  })

  it('Retrieve creator annuities', async () => {
    const charged = new Charged({ providers: providersKovan });
    const nft = charged.NFT(tokenAddress, tokenId);

    const creatorAnnuities = await nft.getCreatorAnnuities();
    const creatorAnnuitiesRedirect = await nft.getCreatorAnnuitiesRedirect();

    expect(creatorAnnuities).toHaveProperty('42.value', 'success');
    expect(creatorAnnuitiesRedirect).toHaveProperty('42.value', 'success');

    expect(readContractMock.mock.calls[0][0]).toBe('chargedSettings');
    expect(readContractMock.mock.calls[0][1]).toBe('getCreatorAnnuities');
    expect(readContractMock.mock.calls[0][2]).toBe(42);
    expect(readContractMock.mock.calls[0][3]).toEqual([
      tokenAddress,
      tokenId
    ]);
  });
});
