import 'dotenv/config';
import Charged from '../src/charged/index';
import { getWallet } from '../src/utils/testUtilities';

describe('chargedState contract test', () => {
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

  it('should set release timelock', async () => {
    const charged = new Charged({ providers: providersKovan, signer })

    const nft = charged.NFT(tokenAddress, tokenId);
    const result = await nft.releaseTimelock(expectedUnlockBlockNumber);
    const successResponse = result.status;

    expect(successResponse).toEqual(1);
  });

  it('should get release timelock', async () => {
    const charged = new Charged({ providers: providersKovan, signer })

    const nft = charged.NFT(tokenAddress, tokenId);
    const releaseState = await nft.getReleaseState(walletAddress);
    const response = releaseState['42'].value;

    // const allowFromAll = response[0];
    const isApproved = response[1];
    const timelock = response[2].toNumber();
    // const tmpTimelockExpiry = response[3].toNumber();

    expect(isApproved).toEqual(true);
    expect(timelock).toEqual(expectedUnlockBlockNumber);

  });

  it('should set discharge timelock', async () => {
    const charged = new Charged({ providers: providersKovan, signer })

    const nft = charged.NFT(tokenAddress, tokenId);
    const result = await nft.dischargeTimelock(expectedUnlockBlockNumber);
    const successResponse = result.status;

    expect(successResponse).toEqual(1);
  });

  it('should get discharge timelock', async () => {
    const charged = new Charged({ providers: providersKovan, signer })

    const nft = charged.NFT(tokenAddress, tokenId);
    const dischargeState = await nft.getDischargeState(walletAddress);
    const response = dischargeState['42'].value;

    // const allowFromAll = response[0];
    const isApproved = response[1];
    const timelock = response[2].toNumber();
    // const tmpTimelockExpiry = response[3].toNumber();

    expect(isApproved).toEqual(true);
    expect(timelock).toEqual(expectedUnlockBlockNumber);
  });

  it('should set bonds timelock', async () => {
    const charged = new Charged({ providers: providersKovan, signer })

    const nft = charged.NFT(tokenAddress, tokenId);
    const result = await nft.bondsTimelock(expectedUnlockBlockNumber);
    const successResponse = result.status;

    expect(successResponse).toEqual(1);
  });

  it('should get bonds timelock', async () => {
    const charged = new Charged({ providers: providersKovan, signer })

    const nft = charged.NFT(tokenAddress, tokenId);
    const bondsState = await nft.getBondsState(walletAddress);
    const response = bondsState['42'].value;

    // const allowFromAll = response[0];
    const isApproved = response[1];
    const timelock = response[2].toNumber();
    // const tmpTimelockExpiry = response[3].toNumber();

    expect(isApproved).toEqual(true);
    expect(timelock).toEqual(expectedUnlockBlockNumber);
  });

});
