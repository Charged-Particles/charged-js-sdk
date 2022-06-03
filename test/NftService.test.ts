import { rpcUrlMainnet } from '../src/utils/config';
import { getWallet } from '../src/utils/testUtilities';
const Web3HttpProvider = require('web3-providers-http');

import Charged from '../src/Charged';

describe('NFT service class', () => {
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
    ];

    const particleBAddress = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
    const tokenId = 43;
    const network = 42;
  
    it.only ('get tokens across more than one network', async () => {
      const charged = new Charged({providers, signer})

      const nft = charged.NFT(particleBAddress, tokenId, network)

      const NftBridgedChains = await nft.getChainIdsForBridgedNFTs();
  
      // check the that keys exist for one network only
      expect(NftBridgedChains).toEqual([{'chainId': network}]);
    });

    it ('Throws when getting tokens across more than one network with wrong ABI', async () => {
      const charged = new Charged({providers})
      const wrongAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
      const tokenId = 43;
      
      await expect(() => {
        const data = charged.utils.getBridgedNFTs(wrongAddress, tokenId);
        return data;
      }).rejects.toThrow();
    });
    
    it ('Gets bridged NFT chain ids using an injected signer', async() => {

      const charged = new Charged({providers, signer});

      
      const nft = charged.NFT(particleBAddress, tokenId, network);
      const NftBridgedChains = await nft.getChainIdsForBridgedNFTs();
      // console.log(NftBridgedChains);

      expect(NftBridgedChains).toEqual([{'chainId': network}]);
    });

    it ('Get bridge NFT chain ids using an external provider', async() => {
      const externalWeb3Provider = new Web3HttpProvider(rpcUrlMainnet);
      const charged = new Charged({externalProvider: externalWeb3Provider});

      const nft = charged.NFT(particleBAddress, tokenId, network)
      const NftBridgedChains = await nft.getSignerAddress();
      console.log(NftBridgedChains)
    });
});
