import { ethers } from 'ethers';
import 'dotenv/config';
import Charged from '../src/charged/index';

// import kovanAddresses from '@charged-particles/protocol-subgraph/networks/kovan.json';
// import mainnetAddresses from '@charged-particles/protocol-subgraph/networks/mainnet.json';

/*
This test uses the team test wallet's mnemonic
Also the alchemy keys as seen below
*/
describe('chargedState contract test', () => {
    const providersKovan =  [
      {
        network: 42,
        service: {'alchemy': process.env.ALCHEMY_KOVAN_KEY}
      }
    ]
    const ENJCoin = '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2';
    const walletAddress = '0x277bfc4a8dc79a9f194ad4a83468484046fafd3a';

    const address = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
    const tokenId = 78;

    it('should energize', async () => {
      // ignoring .env type checking
      // @ts-ignore
      const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
      
      const nft = charged.NFT(address, tokenId);
      const result = await nft.energize('aave.B', ENJCoin, ethers.utils.parseEther("3"));

      // TODO: Expect something with the response?
      expect(result).toHaveProperty('confirmations');
    });

    it ('should set release timelock', async () => {
        // ignoring .env type checking
        // @ts-ignore
        const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
        
        const nft = charged.NFT(address, tokenId);
        const result = await nft.releaseTimelock(32174859);

        console.log({result})
  
        // TODO: Expect something with the response?
        // expect(result).toHaveProperty('confirmations');
    });

    it('should get release timelock', async () => {
        // ignoring .env type checking
        // @ts-ignore
        const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
        
        const nft = charged.NFT(address, tokenId);
        const releaseState = await nft.getReleaseState(walletAddress);

        console.log({'arr': releaseState['42'].value})
  
        // TODO: Expect something with the response?
        // expect(releaseState).toHaveProperty('confirmations');
    });

    it.only ('should set discharge timelock', async () => {
        // ignoring .env type checking
        // @ts-ignore
        const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
        
        const nft = charged.NFT(address, tokenId);
        const result = await nft.dischargeTimelock(32174859);

        console.log({result})
  
        // TODO: Expect something with the response?
        // expect(result).toHaveProperty('confirmations');
    });

    it.only ('should get discharge timelock', async () => {
        // ignoring .env type checking
        // @ts-ignore
        const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
        
        const nft = charged.NFT(address, tokenId);
        const dischargeState = await nft.getDischargeState(walletAddress);

        console.log({'arr': dischargeState['42'].value})
  
        // TODO: Expect something with the response?
        // expect(releaseState).toHaveProperty('confirmations');
    });

});
