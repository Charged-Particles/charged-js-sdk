/**
 * @jest-environment hardhat
 */
const { ethers } = require("hardhat");

const impersonatedAddres = '0x733246BCEE1d39f3Cae699a1f1cFfC97D67D2e57';
const testAddress = '0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A';

describe('Hardhat testing with jest', () => {
  it('Hardhat is exposed', () => {
    expect(hardhat).toBeDefined();
  });

  it('Impersonate account and send ether', async () => {
    const impersonatedSigner = await ethers.getImpersonatedSigner(impersonatedAddres);
    const amountToSend = ethers.utils.parseEther('.01');

    let tx = {
      to: testAddress,
      value:  amountToSend
    }

    const balanceBeforeTransaction = await ethers.provider.getBalance(impersonatedAddres);
    const blockBeforeTransaction = await ethers.provider.getBlockNumber();

    const txResult = await impersonatedSigner.sendTransaction(tx);
    await txResult.wait();

    const balanceAfterTransaction = await ethers.provider.getBalance(impersonatedAddres);
    const blockAfterTransaction = await ethers.provider.getBlockNumber();

    expect(balanceBeforeTransaction.gt(balanceAfterTransaction)).toBe(true);
    expect(blockAfterTransaction - blockBeforeTransaction).toEqual(1);
  });
});

