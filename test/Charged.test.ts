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
    const charged = new Charged({providers})
    const allStateAddresses = await charged.utils.getStateAddress();

    expect(allStateAddresses).toHaveProperty('1');
    expect(allStateAddresses).toHaveProperty('42');

    console.log(allStateAddresses);
  });

  it ('Initializes NFT service', async () => {
    const charged = new Charged({providers});

    const particleBAddress = '0x517fEfB53b58Ec8764ca885731Db20Ca2dcac7b7';
    const tokenId = 4;
    const network = 1;

    const nft = charged.NFT(particleBAddress, tokenId, network);

    expect(nft.contractAddress).toEqual(particleBAddress);
    expect(nft.tokenId).toEqual(tokenId);
    expect(nft.network).toEqual(network);

    const tokenURI = await nft.tokenURI()
    expect(tokenURI).toEqual('https://ipfs.infura.io/ipfs/QmT5ZjLAZevefv3CMiLAD1p1CeoTSc6EWbGY8EmzXaFt85');
  });

  it ('Initializes charged with default providers', async() => {
    const charged = new Charged();

    const providers = charged.providers;

    expect(providers).toHaveProperty('1');
    expect(providers).toHaveProperty('42');
  
    const stateAddresses = await charged.utils.getStateAddress();

    expect(stateAddresses).toHaveProperty('1', '0x48974C6ae5A0A25565b0096cE3c81395f604140f');
    expect(stateAddresses).toHaveProperty('42', '0x121da37d04D1405d96cFEa65F79Eaa095C2582Ca');
  });
})
