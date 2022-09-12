/**
 * @jest-environment hardhat
 */
const { ethers } = require("hardhat");

import * as _ from 'lodash';
import { getWallet } from '../../src/utils/testUtilities';
import { mainnetAddresses } from '../../src';
import Charged from '../../src/charged/index';

describe('NFT service class', () => {
  const signer = getWallet();

  it ('Gets user IONX balance', async () => {
    const charged = new Charged({providers: ethers.provider, signer });
    const ionx = charged.erc20(mainnetAddresses.ionx.address);
    const whaleAddress = '0x0ca678b984186b0117501c00d4a6b4f8f342d06d';

    const whaleBalanceResponse = await ionx.balanceOf(whaleAddress);
    expect(whaleBalanceResponse).toHaveProperty('1.value');

    const whaleBalance = _.get(whaleBalanceResponse, '1.value');
    expect(whaleBalance.toString()).toEqual('46637960330000000000000000');
  });

  it ('Grants permission and fetches it', async () => {
    const whaleAddress = '0x0ca678b984186b0117501c00d4a6b4f8f342d06d';
    const impersonatedSigner = await ethers.getImpersonatedSigner(whaleAddress);
    const charged = new Charged({providers: ethers.provider, signer: impersonatedSigner });
    const ionx = charged.erc20(mainnetAddresses.ionx.address);

    const approveTx = await ionx.approve(signer.address, '100000000');
    // const approveReceipt = await approveTx.wait();
    await approveTx.wait();

    const allowanceResponse = await ionx.allowance(whaleAddress, signer.address);

    const allowanceBalance = _.get(allowanceResponse, '1.value');
    expect(allowanceBalance.toString()).toEqual('100000000');
  });
});
