import Charged from '../src/Charged';

import kovanAddress from '../src/networks/v2/kovan.json';

describe('chargedParticles functions', () => {
    const providers =  [
      {
        network: 42,
        // TODO: DONT UPLOAD KEY
        service: {'alchemy': 'chfBBywxR7dTpJXahb9cUwo90Ds2GBUz'}
      }
    ]
  
    it ('gets state, settings, and managers address', async () => {
      const charged = new Charged({providers})

      const stateAddy = charged.utils.getStateAddress();
      const managersAddy = charged.utils.getManagersAddress();
      const settingsAddy = charged.utils.getSettingsAddress();

      expect(stateAddy).toEqual(kovanAddress.chargedState.address);
      expect(managersAddy).toEqual(kovanAddress.chargedManagers.address);
      expect(settingsAddy).toEqual(kovanAddress.chargedSettings.address);
    });

    // it ('Throws when getting tokens across more than one network with wrong ABI', async () => {
    //   const charged = new Charged({providers})
    //   const wrongAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
    //   const tokenId = 4;
      
    //   await expect(() => {
    //     const data = charged.utils.storeTokenIdsAcrossChains(wrongAddress, tokenId);
    //     return data;
    //   }).rejects.toThrow();
    // });
  
});
