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
    const allStateAddresses = await charged.utils.getAllStateAddresses();

    console.log(allStateAddresses);
  })
})
