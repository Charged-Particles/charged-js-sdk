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
    }
  ]

  it ('Initializes charged SDK', () => {
    const charged = new Charged({providers})

    const chargedProviders = charged.providers;

    console.log(chargedProviders);
  })
  

})
