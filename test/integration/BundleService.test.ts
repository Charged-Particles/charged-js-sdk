/**
 * @jest-environment hardhat
 */
const { ethers } = require("hardhat");

import * as _ from 'lodash';
import Charged from '../../src/charged/index';
import { alchemyMumbaiKey } from '../../src/utils/config';
import { Token } from '../../src/charged/services/BundleService';

jest.useFakeTimers();

describe('Bundle service class', () => {
  // const signer = getWallet();

  const [ address, tokenId, chainId, owner ] = [ '0xd04f13d02ea469dff7eece1b1ae0ca234837db38', '147', 80001, '0xFD424D0E0CD49D6AD8f08893CE0D53F8EAEB4213' ];
  const daiAddresss = '0x9A753f0F7886C9fbF63cF59D0D4423C5eFaCE95B';
  const usdcAddress = '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747';
  const bondedNftAddress = '0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b';

  it('Releases everything', async() => {
    const impersonatedSigner = await ethers.getImpersonatedSigner(owner);

    const charged = new Charged({
      providers: [ { network: chainId, service: { alchemy: alchemyMumbaiKey } } ],
      signer: impersonatedSigner,
    });

    const tokenOne: Token = {
      type: 'erc20',
      receiver: owner,
      walletManagerId: 'generic.B',
      assetAddress: daiAddresss,
    };

    const tokenTwo: Token = {
      type: 'erc20',
      receiver: owner,
      walletManagerId: 'generic.B',
      assetAddress: usdcAddress,
    };

    const tokenThree: Token = {
      type: 'nft',
      receiver: owner,
      walletManagerId: 'generic.B',
      assetAddress: bondedNftAddress,
      assetTokenId: '471511',
      assetTokenAmount: '1',
    };
    const tokens = [ tokenOne, tokenTwo, tokenThree ];

    const nft = charged.NFT(address, tokenId);
    const daiBalance = await nft.getMass(daiAddresss, 'generic.B');
    const usdcBalance = await nft.getMass(usdcAddress, 'generic.B');
    const nftBalance = await nft.getBonds('generic.B');

    expect(daiBalance[chainId].value.toEqual('5000'));
    expect(usdcBalance[chainId].value.toEqual('50'));
    expect(nftBalance[chainId].value.toEqual('1'));

    const bundle = charged.bundle(address, tokenId, tokens, chainId);
    const mReleaseTx = await bundle.multiRelease();
    console.log(mReleaseTx);
  });
});
