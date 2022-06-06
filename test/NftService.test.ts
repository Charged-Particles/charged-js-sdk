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
  
    it ('get tokens across more than one network', async () => {
      const charged = new Charged({providers, signer})

      const nft = charged.NFT(particleBAddress, tokenId)

      const NftBridgedChains = await nft.getChainIdsForBridgedNFTs();
  
      // check the that keys exist for one network only
      expect(NftBridgedChains).toEqual([network]);
    });

    it ('Throws when getting tokens across more than one network with wrong ABI', async () => {
      const charged = new Charged({providers})
      const wrongAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
      const tokenId = 43;
      
      const nft = charged.NFT(wrongAddress, tokenId)

      await expect(async() => {
        return await nft.getChainIdsForBridgedNFTs();
      }).rejects.toThrow();
    });
    
    it.skip ('Gets bridged NFT chain ids using an injected signer', async() => {
      const charged = new Charged({providers, signer});
      const nft = charged.NFT(particleBAddress, tokenId);
      const NftBridgedChains = await nft.getChainIdsForBridgedNFTs();

      expect(NftBridgedChains).toEqual([42]);
    });

    it.skip ('Get bridge NFT chain ids using an external provider', async() => {
      // TODO: avoid hitting the metamask function if not a web3 provider !!!!!
      const externalWeb3Provider = new Web3HttpProvider(rpcUrlMainnet);
      const charged = new Charged({externalProvider: externalWeb3Provider});

      const nft = charged.NFT(particleBAddress, tokenId)
      const NftBridgedChains = await nft.getSignerAddress();
      expect(NftBridgedChains).toEqual(1)
    });

    it ('Get signer connected network id using an external provider', async() => {

      const externalWeb3Provider = new Web3HttpProvider(rpcUrlMainnet);
      const charged = new Charged({externalProvider: externalWeb3Provider});

      const nft = charged.NFT(particleBAddress, tokenId)
      const chainId = await nft.getSignerConnectedNetwork();
      expect(chainId).toEqual(1)
    });

    it ('Get signer connected network id using > 1 providers', async() => {
      const charged = new Charged({providers, signer});
      const nft = charged.NFT(particleBAddress, tokenId);
      const chainId = await nft.getSignerConnectedNetwork(1);
      expect(chainId).toEqual(1);
    });

    it ('Get signer connected network id using 1 provider', async() => {
      const _providers = [
        {
          network: 42,
          service: {'alchemy': 'rm-l6Zef1007gyxMQIwPI8rEhaHM8N6a'}
        }
      ]
      const charged = new Charged({providers: _providers, signer});

      const nft = charged.NFT(particleBAddress, tokenId);
      const chainId = await nft.getSignerConnectedNetwork();
      expect(chainId).toEqual(_providers[0].network);
    });
});
