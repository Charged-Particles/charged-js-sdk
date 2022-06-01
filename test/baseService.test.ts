import Charged from '../src/Charged';

describe('baseService class', () => {
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

      const data = await charged.utils.storeTokenIdsAccrossChains(particleBAddress, tokenId);
  
      // check the that keys exist for one network only
      expect(data[0]).toHaveProperty('tokenId', 4);
      expect(data[0]).toHaveProperty('chainId', 42);
      expect(data[0]).toHaveProperty('ownerOf', '0x6d46b37708dA7Ed4E5C4509495768Fecd3D17C01');
    });
  
});
