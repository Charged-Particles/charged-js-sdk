import 'dotenv/config';
import Charged from '../src/index';
import { ethers } from 'ethers';
import { getWallet } from '../src/utils/testUtilities';
import _ from 'lodash';
import { getAddress } from '../src/utils/contractUtilities';

describe('Web3Pack / Bundle contract test', () => {

  it ('Unbundles / Multireleases 2 Erc20s', async() => {
    const signer = getWallet();
    const providers = [
      {
        network: 80001,
        service: { 'alchemy': process.env.ALCHEMY_MUMBAI_KEY }
      },
    ];
  
    const [
      address,
      tokenId,
      chainId,
      owner
    ] = [
      '0xd04f13d02ea469dff7eece1b1ae0ca234837db38',
      '147',
      80001,
      '0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A'
    ];

    const [ 
      daiAddress,
      usdcAddress,
      mumbaiWeb3PackContract,
      chargedParticlesContract
    ] = [
      '0x9A753f0F7886C9fbF63cF59D0D4423C5eFaCE95B',
      '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
      '0x70a7336371C0f0e064Bf2BA0B5e9682C20B3ebca',
      getAddress(chainId, 'chargedParticles')
    ];
  
    // ~~
    // charged set up
    // ~~
    const charged = new Charged({ providers, signer });
    const nft = charged.NFT(address, tokenId);

    // ~~
    // approvals
    // ~~
    const dai = charged.erc20(daiAddress);
    const usdc = charged.erc20(usdcAddress);
    const daiApproveTx = await dai.approve(chargedParticlesContract, ethers.utils.parseUnits('5000'));
    await daiApproveTx.wait();
    const usdcApproveTx = await usdc.approve(chargedParticlesContract, ethers.utils.parseUnits('50', 6));
    await usdcApproveTx.wait();


    let allowanceResponse = await dai.allowance(owner, chargedParticlesContract);
    let allowanceBalance = _.get(allowanceResponse, `${chainId}.value`);
    expect(ethers.utils.formatUnits(allowanceBalance)).toEqual('5000.0');

    allowanceResponse = await usdc.allowance(owner, chargedParticlesContract);
    allowanceBalance = _.get(allowanceResponse, `${chainId}.value`);
    expect(ethers.utils.formatUnits(allowanceBalance, 6)).toEqual('50.0');

    // ~~
    // energize
    // ~~
    const energizeTxOne = await nft.energize(daiAddress, ethers.utils.parseUnits('5000'), 'generic.B', chainId);
    await energizeTxOne.wait();
    const energizeTxTwo = await nft.energize(usdcAddress, ethers.utils.parseUnits('50', 6), 'generic.B', chainId);
    await energizeTxTwo.wait();
  
    let daiBalance = await nft.getMass(daiAddress, 'generic.B');
    let usdcBalance = await nft.getMass(usdcAddress, 'generic.B');
    
    const approveTx = await nft.setReleaseApproval(mumbaiWeb3PackContract);
    await approveTx.wait();
    expect(ethers.utils.formatUnits(daiBalance[chainId].value)).toEqual('5000.0');
    expect(ethers.utils.formatUnits(usdcBalance[chainId].value, 6)).toEqual('50.0');
  
    const mReleaseTx = await nft.multiRelease(
      owner,
      'generic.B',
      { erc20TokenAddresses: [ daiAddress, usdcAddress ] },
      chainId
    );
    await mReleaseTx.wait();

    daiBalance = await nft.getMass(daiAddress, 'generic.B');
    usdcBalance = await nft.getMass(usdcAddress, 'generic.B');
  
    expect(ethers.utils.formatUnits(daiBalance[chainId].value)).toEqual('0.0');
    expect(ethers.utils.formatUnits(usdcBalance[chainId].value, 6)).toEqual('0.0');
  })
});
