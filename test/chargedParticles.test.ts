import { ContractTransaction, ethers } from 'ethers';
import 'dotenv/config';
import Charged from '../src/index';
import { chargedParticlesAbi, mainnetAddresses, kovanAddresses } from '../src/index';

/*
This test uses the team test wallet's mnemonic
Also the alchemy keys as seen below
*/
describe('chargedParticles contract test', () => {
    const providersKovan =  [
      {
        network: 42,
        service: {'alchemy': process.env.ALCHEMY_KOVAN_KEY}
      }
    ]
    const providers =  [
      {
        network: 1,
        service: {'alchemy': process.env.ALCHEMY_MAINNET_KEY}
      },
      {
        network: 42,
        service: {'alchemy': process.env.ALCHEMY_KOVAN_KEY}
      }
    ]
    
    const ENJCoin = '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2';
    const walletAddress = '0x277bfc4a8dc79a9f194ad4a83468484046fafd3a';

    const address = '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963';
    const tokenId = 18;

    it ('get state, managers, and settings  correctly on multiple chains', async () => {

      const charged = new Charged({providers});

      const stateAddys = await charged.utils.getStateAddress();
      const managersAddys = await charged.utils.getManagersAddress();
      const settingsAddys = await charged.utils.getSettingsAddress();
  
      // check the that keys exist for one network only
      expect(stateAddys).toHaveProperty('42.value', kovanAddresses.chargedState.address);
      expect(managersAddys).toHaveProperty('42.value', kovanAddresses.chargedManagers.address);
      expect(settingsAddys).toHaveProperty('42.value', kovanAddresses.chargedSettings.address);
      expect(stateAddys).toHaveProperty('1.value', mainnetAddresses.chargedState.address);
      expect(managersAddys).toHaveProperty('1.value', mainnetAddresses.chargedManagers.address);
      expect(settingsAddys).toHaveProperty('1.value', mainnetAddresses.chargedSettings.address);
    });

    // test discharge here so we can expect 0 interest on next test 
    it ('should discharge', async () => {
      // ignoring .env type checking
      // @ts-ignore
      const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
      
      const nft = charged.NFT(address, tokenId);
      const result: ContractTransaction = await nft.discharge(walletAddress, 'aave.B', ENJCoin);

      // TODO: Expect something with the response?
      expect(result).toHaveProperty('confirmations');
      result.wait();
    })

    it ('should get mass, charge, and # of bonds of a proton', async () => {
      // ignoring .env type checking
      // @ts-ignore
      const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
      
      const nft = charged.NFT(address, tokenId);
      const massBN = await nft.getMass('aave.B', '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2');
      const chargeBN = await nft.getCharge('aave.B', '0xC64f90Cd7B564D3ab580eb20a102A8238E218be2');
      const bondsBN = await nft.getBonds('generic.B');
      const mass = ethers.utils.formatUnits(massBN['42'].value);
      const charge = ethers.utils.formatUnits(chargeBN['42'].value);
      const bonds = bondsBN['42'].value.toNumber();

      expect(Number(mass)).toBeCloseTo(1094);
      // This value could be out of date. Check https://staging.app.charged.fi/go/energize/0xd1bce91a13089b1f3178487ab8d0d2ae191c1963/18
      expect(Number(charge)).toBeCloseTo(0);
      expect(Number(bonds)).toEqual(3);
    });

    it ('should energize', async () => {
      // ignoring .env type checking
      // @ts-ignore
      const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
      
      const nft = charged.NFT(address, tokenId);
      const result: ContractTransaction = await nft.energize('aave.B', ENJCoin, ethers.utils.parseEther("47"));

      // TODO: Expect something with the response?
      expect(result).toHaveProperty('confirmations');
      result.wait();
    });

    it ('should release 47 ENJ tokens', async () => {
      // ignoring .env type checking
      // @ts-ignore
      const charged = new Charged({providers: providersKovan, signer: ethers.Wallet.fromMnemonic(process.env.MNEMONIC)})
      
      const nft = charged.NFT(address, tokenId);
      const result: ContractTransaction = await nft.releaseAmount(walletAddress, 'aave.B', ENJCoin, ethers.utils.parseEther("47"));

      // TODO: Expect something with the response?
      expect(result).toHaveProperty('confirmations');
      result.wait();
    })
  
    it ('should create a contract from exported abis', async () => {
      const contract = new ethers.Contract(
        mainnetAddresses.chargedParticles.address,
        chargedParticlesAbi,
        ethers.getDefaultProvider()
      )

      expect(await contract.getStateAddress()).toEqual(mainnetAddresses.chargedState.address);
    })
});
