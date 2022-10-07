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
      network: 5,
      service: { 'alchemy': process.env.ALCHEMY_GOERLI_KEY }
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

  it ('Get the owner of the NFT', async() => {
    const charged = new Charged({ providers: ethers.provider, signer });
    const nft = charged.NFT(mainnetAddresses.protonB.address, tokenId);
    const ownerOf = await nft.ownerOf();
    expect(ownerOf).toHaveProperty('1.value','0x0a2e95EbA92C86b617c36A8A73d3913F279F1CDE');
  });

  it ('Approves erc721 NFT ', async() => {
    const apeOwner = '0x46EFbAedc92067E6d60E84ED6395099723252496';
    const impersonatedSigner = await ethers.getImpersonatedSigner(apeOwner);
    const charged = new Charged({ providers: ethers.provider, signer: impersonatedSigner });
    const nft = charged.NFT('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', 1);
    const approveTx = await nft.approve(signer.address);
    await approveTx.wait();
    const approvedUser = await nft.getApproved();
    expect(approvedUser).toHaveProperty('1.value', signer.address);
  });

  it ('Mint and transfer an NFT', async() => {
    // Impersonate nft owner
    const apeOwner = '0x46EFbAedc92067E6d60E84ED6395099723252496';
    const impersonatedSigner = await ethers.getImpersonatedSigner(apeOwner);

    const charged = new Charged({ providers: ethers.provider, signer: impersonatedSigner });
    const nft = charged.NFT('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', 1);

    const ownerOfBeforeTransfer = await nft.ownerOf();
    expect(ownerOfBeforeTransfer).toHaveProperty('1.value','0x46EFbAedc92067E6d60E84ED6395099723252496');

    const transferTx = await nft.transferFrom(apeOwner, signer.address)
    await transferTx.wait();

    const ownerOfAfterTransfer = await nft.ownerOf();
    expect(ownerOfAfterTransfer).toHaveProperty('1.value', signer.address);
  });

  it ('Approves erc1155 NFT', async() => {
    const abi = [
      'function balanceOf(address account, uint256 id) external view returns (uint256)'
    ]
    
    const nftOwner = '0x52cf48ec3485c2f1312d9f1f1ddd3fca9cc232e3';
    const contract = new ethers.Contract('0xa755c08a422434C480076c80692d9aEe67bCea2B', abi, ethers.provider);
    const balanceOf = await contract.balanceOf(nftOwner, 1);
    expect(balanceOf.toNumber()).toBe(3577);
    
    // grant approval
    const impersonatedSigner = await ethers.getImpersonatedSigner(nftOwner);
    const charged = new Charged({ providers: ethers.provider, signer: impersonatedSigner });

    const nft = charged.NFT('0xa755c08a422434C480076c80692d9aEe67bCea2B', 1);
    const approveTx = await nft.setApprovalForAll(signer.address, true);
    await approveTx.wait();

    // Check permission
    const approvedUser = await nft.isApprovedForAll(nftOwner, signer.address);
    expect(approvedUser).toHaveProperty('1.value', true);
  });

  it ('Transfer an 1155', async() => {
    const abi = [
      'function balanceOf(address account, uint256 id) external view returns (uint256)'
    ]
    
    const nftOwner = '0x52cf48ec3485c2f1312d9f1f1ddd3fca9cc232e3';
    const nftReceiver = '0x2e4f5cf824370a47C4DBD86281d3875036A30534';

    const contract1155 = new ethers.Contract('0xa755c08a422434C480076c80692d9aEe67bCea2B', abi, ethers.provider);
    const balanceOfBeforeTransfer = await contract1155.balanceOf(nftOwner, 1);
    expect(balanceOfBeforeTransfer.toNumber()).toBe(3577);
    
    const impersonatedSigner = await ethers.getImpersonatedSigner(nftOwner);
    const charged = new Charged({ providers: ethers.provider, signer: impersonatedSigner });

    const amountToTransfer = 5;
    const nft = charged.NFT('0xa755c08a422434C480076c80692d9aEe67bCea2B', 1);
    const approveTx = await nft.erc1155SafeTransfer(impersonatedSigner.address, nftReceiver, amountToTransfer);
    await approveTx.wait();

    // Check transfer
    const receiverAddressBalance = await contract1155.balanceOf(nftReceiver, 1);
    expect(receiverAddressBalance.toNumber()).toBe(amountToTransfer);
  })
});
