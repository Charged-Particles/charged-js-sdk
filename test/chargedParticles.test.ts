import { ethers } from 'ethers';
import 'dotenv/config';
import Charged from '../src/Charged';

import kovanAddresses from '../src/networks/v2/kovan.json';
import mainnetAddresses from '../src/networks/v2/mainnet.json';

describe('baseService class', () => {
    const providersKovan =  [
      {
        network: 42,
        service: {'alchemy': 'rm-l6Zef1007gyxMQIwPI8rEhaHM8N6a'}
      }
    ]
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
    

    it ('get state, managers, and settings addresses correctly on multiple chains', async () => {

      const charged = new Charged({providers});

      const stateAddys = await charged.utils.getStateAddress();
      const managersAddys = await charged.utils.getManagersAddress();
      const settingsAddys = await charged.utils.getSettingsAddress();
  
      // check the that keys exist for one network only
      expect(stateAddys).toHaveProperty('42', kovanAddresses.chargedState.address);
      expect(managersAddys).toHaveProperty('42', kovanAddresses.chargedManagers.address);
      expect(settingsAddys).toHaveProperty('42', kovanAddresses.chargedSettings.address);
      expect(stateAddys).toHaveProperty('1', mainnetAddresses.chargedState.address);
      expect(managersAddys).toHaveProperty('1', mainnetAddresses.chargedManagers.address);
      expect(settingsAddys).toHaveProperty('1', mainnetAddresses.chargedSettings.address);
    });

    it ('should get mass, charge, and # of bonds of a proton', async () => {
      // @ts-ignore
      const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
      const address = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
      const tokenId = 18;
      
      const nft = charged.NFT(address, tokenId);
      const massBN = await nft.getMass('aave.B', '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2');
      const chargeBN = await nft.getCharge('aave.B', '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2');
      const bondsBN = await nft.getBonds('generic.B');
      console.log(chargeBN)
      console.log(bondsBN)
      const mass = ethers.utils.formatUnits(massBN['42']);
      const charge = ethers.utils.formatUnits(chargeBN['42']);
      const bonds = bondsBN['42'].toNumber();

      expect(Number(mass)).toEqual(1000);
      // This value could be out of date. Check https://staging.app.charged.fi/go/energize/0xd1bce91a13089b1f3178487ab8d0d2ae191c1963/18
      expect(Number(charge)).toBeCloseTo(0.07);
      expect(Number(bonds)).toEqual(3);
    });

    it ('should energize', async () => {
      // @ts-ignore
      const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
      const address = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
      const tokenId = 18;
      
      const nft = charged.NFT(address, tokenId);
      const result = await nft.energize('aave.B', '0x075A36BA8846C6B6F53644fDd3bf17E5151789DC', 10, '');

      console.log(result);
      expect(1).toEqual(1);
    });
  
});
