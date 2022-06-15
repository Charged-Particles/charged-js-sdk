/*
METHODS:
get/setCreatorAnnuities
get/setCreatorAnnuitiesRedirect
*/
import { ethers } from 'ethers';
import 'dotenv/config';
import Charged from '../src/index';

/*
This test uses the team test wallet's mnemonic
Also the alchemy keys as seen below
*/
describe('chargedSettings contract test', () => {
    const providersKovan =  [
      {
        network: 42,
        service: {'alchemy': process.env.ALCHEMY_KOVAN_KEY}
      }
    ]

    const creatorAddy = '0x277BFc4a8dc79a9F194AD4a83468484046FAFD3A';
    const address = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
    const tokenId = 85;

    
    it ('should change annuity pct', async () => {
      // ignoring .env type checking
      // @ts-ignore
      const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
      
      const receiver = '0xFD424D0E0CD49D6AD8f08893CE0D53F8EAEB4213';
      const nft = charged.NFT(address, tokenId);
      const result = await nft.setCreatorAnnuities(creatorAddy, '9700');
      const result2 = await nft.setCreatorAnnuitiesRedirect(receiver);
      
      // TODO: Expect something with the response?
      expect(result).toHaveProperty('confirmations');
      expect(result2).toHaveProperty('confirmations');
    })
    
    it.only  ('should get creator annuities', async () => {
      // ignoring .env type checking
      // @ts-ignore
      const charged = new Charged({providers: providersKovan})
      
      const nft = charged.NFT(address, tokenId);
      const creatorAnnuities = await nft.getCreatorAnnuities();
      const creatorAnnuitiesRedirect = await nft.getCreatorAnnuitiesRedirect();

      expect(creatorAnnuities).toHaveProperty('42.value');
      expect(creatorAnnuitiesRedirect).toHaveProperty('42.value');
    });
});
