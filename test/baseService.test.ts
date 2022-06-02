import Charged from '../src/Charged';
import { getWallet } from '../src/utils/ethers.service';

describe('baseService class', () => {
    const signer = getWallet();
    const providers =  [
      {
        network: 1,
        service: {'alchemy': 'qw02QqWNMg2kby3q3N39PxUT3KaRS5UE'}
      },
      {
        network: 42,
        service: {'alchemy': 'rm-l6Zef1007gyxMQIwPI8rEhaHM8N6a'}
      }
    ]
  
    it ('get tokens across more than one network', async () => {
      const charged = new Charged({providers})
      const particleBAddress = '0x517fEfB53b58Ec8764ca885731Db20Ca2dcac7b7';
      const tokenId = 4;

      const data = await charged.utils.getBridgedNFTs(particleBAddress, tokenId);
  
      // check the that keys exist for one network only
      expect(data[0]).toHaveProperty('tokenId', 4);
      expect(data[0]).toHaveProperty('chainId', 42);
      expect(data[0]).toHaveProperty('ownerOf', '0x6d46b37708dA7Ed4E5C4509495768Fecd3D17C01');
    });

    it ('Throws when getting tokens across more than one network with wrong ABI', async () => {
      const charged = new Charged({providers})
      const wrongAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
      const tokenId = 4;
      
      await expect(() => {
        const data = charged.utils.getBridgedNFTs(wrongAddress, tokenId);
        return data;
      }).rejects.toThrow();
    });
    
    it.only ('Gets bridged NFT chain id using an injected signer', async() => {

      const charged = new Charged({providers, signer});
      const particleBAddress = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
      const tokenId = 18;
      const network = 42;
      
      const nft = charged.NFT(particleBAddress, tokenId, network);
   
      const NftBridgedChains = await nft.getChainIdsForBridgedNFTs(particleBAddress, tokenId);

      expect(NftBridgedChains).toBe([]);

    })
});
