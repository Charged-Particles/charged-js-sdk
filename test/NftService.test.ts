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

    const particleBAddressKovan = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
    const particleBAddressMainnet = '0x04d572734006788B646ce35b133Bdf7160f79995';
    const tokenId = 43;
    const network = 42;
  
    it ('get tokens across more than one network', async () => {
      const charged = new Charged({providers, signer});

      const nft = charged.NFT(particleBAddressKovan, tokenId);

      const NftBridgedChains = await nft.getChainIdsForBridgedNFTs();
  
      // check the that keys exist for one network only
      expect(NftBridgedChains).toEqual([network]);
    });

    it ('Gets bridged NFT chains using providers array', async() => {
      const charged = new Charged({providers, signer});
      const nft = charged.NFT(particleBAddressKovan, tokenId);

      const NftBridgedChains = await nft.getChainIdsForBridgedNFTs();

      expect(NftBridgedChains).toEqual([42]);
    });

    it ('Get bridge NFT chain ids using injected provider', async() => {
      const externalWeb3Provider = new Web3HttpProvider(rpcUrlMainnet);
      const charged = new Charged({providers: externalWeb3Provider});

      const nft = charged.NFT(particleBAddressMainnet, tokenId)
      const NftBridgedChains = await nft.getChainIdsForBridgedNFTs();
      expect(NftBridgedChains).toEqual(1)

      const nftKovanAddress = charged.NFT(particleBAddressKovan, tokenId)
      const NftBridgedChainsKovan = await nftKovanAddress.getChainIdsForBridgedNFTs();
      expect(NftBridgedChainsKovan).toEqual([]);
    });

    it ('Get signer connected network id using an external provider', async() => {
      const externalWeb3Provider = new Web3HttpProvider(rpcUrlMainnet);
      const charged = new Charged({providers: externalWeb3Provider});
      const nft = charged.NFT(particleBAddressKovan, tokenId);

      const chainId = await nft.getSignerConnectedNetwork();
      expect(chainId).toEqual(1);
    });
});
