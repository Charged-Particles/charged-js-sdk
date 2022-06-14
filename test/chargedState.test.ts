import { ethers } from 'ethers';
import 'dotenv/config';
import Charged from '../src/charged/index';

describe('chargedState contract test', () => {
    const providersKovan =  [
      {
        network: 42,
        service: {'alchemy': process.env.ALCHEMY_KOVAN_KEY}
      }
    ]
    const ENJCoin = '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2';
    const walletAddress = '0x277bfc4a8dc79a9f194ad4a83468484046fafd3a';

    const expectedTimelockedBlockNumber = 32174859;

    const address = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
    const tokenId = 78;

    it('should energize', async () => {
      // ignoring .env type checking
      // @ts-ignore
      const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
      
      const nft = charged.NFT(address, tokenId);
      const result = await nft.energize('aave.B', ENJCoin, ethers.utils.parseEther("3"));

      console.log({result});
    });

    it ('should set release timelock', async () => {
        // ignoring .env type checking
        // @ts-ignore
        const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
        
        const nft = charged.NFT(address, tokenId);
        const result = await nft.releaseTimelock(expectedTimelockedBlockNumber);

        console.log({result});
    });

    it('should get release timelock', async () => {
        // ignoring .env type checking
        // @ts-ignore
        const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
        
        const nft = charged.NFT(address, tokenId);
        const releaseState = await nft.getReleaseState(walletAddress);

        const response = releaseState['42'].value;        

        const allowFromAll = response[0];
        const isApproved = response[1];
        const timelock = response[2].toNumber();
        const tmpTimelockExpiry = response[3].toNumber();

        console.log({allowFromAll, isApproved, timelock, tmpTimelockExpiry});
    });

    it('should set discharge timelock', async () => {
        // ignoring .env type checking
        // @ts-ignore
        const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
        
        const nft = charged.NFT(address, tokenId);
        const result = await nft.dischargeTimelock(expectedTimelockedBlockNumber);

        console.log({result});
    });

    it('should get discharge timelock', async () => {
        // ignoring .env type checking
        // @ts-ignore
        const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
        
        const nft = charged.NFT(address, tokenId);
        const dischargeState = await nft.getDischargeState(walletAddress);

        const response = dischargeState['42'].value;

        const allowFromAll = response[0];
        const isApproved = response[1];
        const timelock = response[2].toNumber();
        const tmpTimelockExpiry = response[3].toNumber();

        console.log({allowFromAll, isApproved, timelock, tmpTimelockExpiry});

        expect(isApproved).toEqual(true);
        expect(timelock).toEqual(expectedTimelockedBlockNumber);
    });

    it('should set bonds timelock', async () => {
        // ignoring .env type checking
        // @ts-ignore
        const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
        
        const nft = charged.NFT(address, tokenId);
        const result = await nft.bondsTimelock(expectedTimelockedBlockNumber);

        console.log({result})
    });

    it('should get bonds timelock', async () => {
        // ignoring .env type checking
        // @ts-ignore
        const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
        
        const nft = charged.NFT(address, tokenId);
        const bondsState = await nft.getBondsState(walletAddress);

        const response = bondsState['42'].value;

        const allowFromAll = response[0];
        const isApproved = response[1];
        const timelock = response[2].toNumber();
        const tmpTimelockExpiry = response[3].toNumber();

        console.log({allowFromAll, isApproved, timelock, tmpTimelockExpiry});

        expect(isApproved).toEqual(true);
        expect(timelock).toEqual(expectedTimelockedBlockNumber);
    });

});
