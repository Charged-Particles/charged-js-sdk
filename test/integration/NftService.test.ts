/**
 * @jest-environment hardhat
 */
const { ethers } = require("hardhat");
const Web3HttpProvider = require('web3-providers-http');

import { BigNumber } from '@ethersproject/bignumber';
import { rpcUrlMainnet } from '../../src/utils/config';
import { getWallet } from '../../src/utils/testUtilities';
import { mainnetAddresses } from '../../src';
import Charged from '../../src/charged/index';

describe('NFT service class', () => {
  const signer = getWallet();
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

  const tokenId = 2;
  const network = 1;

  it('get tokens across more than one network', async () => {
    const charged = new Charged({ providers, signer });
    const nft = charged.NFT(mainnetAddresses.protonB.address, tokenId);
    const NftBridgedChains = await nft.getChainIdsForBridgedNFTs();
    // check the that keys exist for one network only
    expect(NftBridgedChains).toEqual([network]);
  });

  it('Gets bridged NFT chains using providers array', async () => {
    const charged = new Charged({ providers: ethers.provider, signer });
    const nft = charged.NFT(mainnetAddresses.protonB.address, tokenId);
    const NftBridgedChains = await nft.getChainIdsForBridgedNFTs();
    expect(NftBridgedChains).toEqual([1]);
  });

  it('Get bridge NFT chain ids using injected provider', async () => {
    const externalWeb3Provider = new Web3HttpProvider(rpcUrlMainnet);
    const charged = new Charged({ providers: externalWeb3Provider });
    const nft = charged.NFT(mainnetAddresses.protonB.address, tokenId)
    const NftBridgedChains = await nft.getChainIdsForBridgedNFTs();
    expect(NftBridgedChains).toEqual([1])
  });

  it('Get signer connected network id using an external provider', async () => {
    const charged = new Charged({ providers: ethers.provider });
    const nft = charged.NFT(mainnetAddresses.protonB.address, tokenId);

    const chainId = await nft.getSignerConnectedNetwork();
    expect(chainId).toEqual(1);
  });

  it('Avoids hitting the wrong network', async () => {
    const externalWeb3Provider = new Web3HttpProvider(rpcUrlMainnet); // TODO: use local testnet
    const charged = new Charged({ providers: externalWeb3Provider });

    const particleBAddress = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
    const tokenId = 43;
    const network = 42;

    const nft = charged.NFT(particleBAddress, tokenId);

    await expect(async () => {
      return await nft.energize(
        '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
        BigNumber.from(10),
        'aave.B',
        network
      );
    }).rejects.toThrow();
  })

  it('Sets nonce to 1 for transaction', async () => {
    const userSetting = { transactionOverride: { nonce: 1 }, sdk: {NftBridgeCheck: true} }
    const particleBAddress = '0x1CeFb0E1EC36c7971bed1D64291fc16a145F35DC';
    const tokenId = 2;
    const network = 1;

    const charged = new Charged({ providers: ethers.provider, signer, config: userSetting });
    expect(charged).toHaveProperty('state.configuration.transactionOverride.nonce', 1);

    const nft = charged.NFT(particleBAddress, tokenId);

    await expect(async () => {
      return await nft.energize(
        '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
        BigNumber.from(10),
        'aave.B',
        network
      );
    }).rejects.toThrow();
  });

  it ('Throws if wrong wallet manager id is passed', async () => {
    const charged = new Charged({ providers: ethers.provider, signer });
    const nft = charged.NFT(mainnetAddresses.protonB.address, tokenId);
    await expect(async () => {
      //@ts-ignore
      await nft.getMass('0xDAI', 'NotSupportedWalletManager');
    }).rejects.toThrow('Provided a not supported wallet manager id.'); 

    await expect(async () => {
      //@ts-ignore
      await nft.getBonds('NotSupportedBasketManager');
    }).rejects.toThrow('Provided a not supported basket manager id.'); 

    const bondsOnNft = await nft.getBonds('generic.B');
    expect(bondsOnNft).toHaveProperty('1.status', 'fulfilled');
  });
});
