/**
 * @jest-environment hardhat
 */
const { ethers } = require("hardhat");
import { getWallet } from '../src/utils/testUtilities';
import { getAddress } from '../src/utils/contractUtilities';
import erc20Abi from './abi/erc20.json';
import Charged from '../src/index';
import _ from 'lodash';

import { BigNumber } from 'ethers';
import { mainnetAddresses } from '../src/index';


describe('Web3Pack / Bundle contract test', async() => {

  it.skip('Unbundles / Multireleases 2 Erc20s', async() => {
    const signer = getWallet();
  
    const [
      tokenId,
      chainId,
      owner
    ] = [
      '1',
      1,
      signer.address 
    ];

    const [ 
      daiAddress,
      // usdcAddress,
      chargedParticlesContract
    ] = [
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      // '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      getAddress(Number(chainId), 'chargedParticles')
    ];

    // Fund user 
    const daiWhaleAddress = '0x31d3243CfB54B34Fc9C73e1CB1137124bD6B13E1';

    const impersonatedDaiWhaleSigner = await ethers.getImpersonatedSigner(daiWhaleAddress);
    const erc20Contract = new ethers.Contract(daiAddress, erc20Abi, impersonatedDaiWhaleSigner);
    const whaleBalanceBeforeTransfer = await erc20Contract.balanceOf(daiWhaleAddress);
    expect(whaleBalanceBeforeTransfer).toEqual(ethers.BigNumber.from('15552713517234070012390106'));

    const daiFundTxTransfer = await erc20Contract.transfer(signer.address, 1000);
    await daiFundTxTransfer.wait();
    
    expect(await erc20Contract.balanceOf(signer.address)).toEqual(BigNumber.from('1000'))

    // ~~
    // charged set up
    // ~~
    const charged = new Charged({ providers: ethers.provider, signer });
    const nft = charged.NFT(mainnetAddresses.protonB.address, tokenId);

    // ~~
    // approvals
    // ~~
    const dai = charged.erc20(daiAddress);
    const daiApproveTx = await dai.approve(chargedParticlesContract, ethers.utils.parseUnits('5000'));
    await daiApproveTx.wait();
    const userDaiBalance = await dai.balanceOf(signer.address);
    console.log(signer.address, ' dai balance >>>>>', userDaiBalance, userDaiBalance['1'].value.toString());

    let allowanceResponse = await dai.allowance(owner, chargedParticlesContract);
    let allowanceBalance = _.get(allowanceResponse, `${chainId}.value`, BigNumber.from(0));
    expect(ethers.utils.formatUnits(allowanceBalance)).toEqual('5000.0');

    // ~~
    // energize
    // ~~
    const energizeTxOne = await nft.energize(daiAddress, 1000, 'generic.B', chainId);
    await energizeTxOne.wait();

    let daiBalance = await nft.getMass(daiAddress, 'generic.B');
    
    const approveTx = await nft.setReleaseApproval(mumbaiWeb3PackContract);
    await approveTx.wait();

    expect(ethers.utils.formatUnits(daiBalance[chainId].value)).toEqual(BigNumber.from('1000'));
  
    // const mReleaseTx = await nft.multiRelease(
    //   owner,
    //   'generic.B',
    //   { erc20TokenAddresses: [ daiAddress, usdcAddress ] },
    //   chainId
    // );
    // await mReleaseTx.wait();

    // daiBalance = await nft.getMass(daiAddress, 'generic.B');
    // usdcBalance = await nft.getMass(usdcAddress, 'generic.B');
  
    // expect(ethers.utils.formatUnits(daiBalance[chainId].value)).toEqual('0.0');
    // expect(ethers.utils.formatUnits(usdcBalance[chainId].value, 6)).toEqual('0.0');
  })
});
