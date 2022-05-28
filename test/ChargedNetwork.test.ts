// import { ethers } from 'ethers'

// import { getWallet } from '../src/utils/ethers.service';
// import { rpcUrlMainnet } from '../src/utils/config';
import Charged from '../src/Charged';


describe('Charged class', () => {
  // const myWallet = getWallet();
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

  it ('Initializes charged SDK', async () => {
    const charged = new Charged(providers)
    const allStateAddresses = await charged.utils.getStateAddresses();

    expect(allStateAddresses).toHaveLength(2);

    console.log(allStateAddresses);
  });

  it.only ('Initializes NFT service', async () => {
    const charged = new Charged(providers);

    const particleBAddress = '0x517fEfB53b58Ec8764ca885731Db20Ca2dcac7b7';
    const tokenId = 4;
    const network = 1;

    const NFT = charged.NFT(particleBAddress, tokenId, network);

    expect(NFT.particleAddress).toEqual(particleBAddress);
    expect(NFT.tokenId).toEqual(tokenId);
    expect(NFT.network).toEqual(network);

    const tokenURI = await NFT.tokenURI()
    expect(tokenURI).toEqual('https://ipfs.infura.io/ipfs/QmT5ZjLAZevefv3CMiLAD1p1CeoTSc6EWbGY8EmzXaFt85');
  });
})
