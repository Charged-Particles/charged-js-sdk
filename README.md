# Charged Particles SDK

The Charged Particles SDK is a tool kit to help develops interact with the protocol with as little friction as possible. Click here to learn more about the protocol.

## Features

- Full support for Charged Particles contracts. External contracts are…
- Easy to build with. Just pass provider keys and a signer if you wish to write and start building!
- Compatible with either a web ui or a node environment.
- Built with bridged NFTs in mind.
- Multi-network fetching.
- Extensive documentation.
- Typescript ready.

This SDK uses ethers.js internally but will accept web3 providers and signers.

## Common Terminology

The SDK may use language you are unfamiliar with if you have never used the Charged Particles protocol. Let’s warm up with the terms you will see frequently.

### Particles / Protons

Particles are simply any ERC721 compatible (maddy link to the 721 standard maybe?) NFTs. Proton’s on the other hand are NFTs minted through the Charged Particles dApp.

Going forward I will refer to NFTs as particles or NFTs interchangeably. 

### Energizing

Energizing a particle means to deposit assets (i.e. ERC20 Tokens, ERC721 or ERC1155 Tokens) into the NFT. The particle will then “control” these assets and be stored within. Transferring the NFT also transfers these assets.

### Mass

The assets in the particle.

### Charge

The interest generated in the particle.

### Discharging

If you energize your particle with an interest bearing token (Any ERC20 compatible with Aave currently), it will accrue interest or **charge** while bonded to the particle. Users have the choice of discharging this interest either the full amount or a specified amount whenever they choose.

### Releasing

Separates assets from the particle. Users can specify the amount released.

### Bonding

Bonding is the same as energizing but we use this term when speaking about both ERC721 and ERC1155 NFTs. If you use the protocol on a lower level you will see this as covalent bonding.

# Quick Start

### Installation

The SDK is available as a NPM package. Install using

```jsx
yarn add @charged-particles/sdk
// or with npm
npm install @charged-particles/sdk
```

### Configuration

*Be careful not to keep your API keys, seed phrase, or private key in clear text!*

```jsx
import { Charged } from '@charged-particles/sdk'

/*
Create your array with the providers you wish to use. It's best to provide at
least 2 sources.
This is for creating an ethers.js DefaultProvider.
*/
const mySpecialProviders = [
	{
		network: 1,
		service: { 
			'alchemy': 'APIKEY12345',
			'etherscan': 'ILOVEETHERSCAN123',
			'infura': 'HELLOINFURA',
		},
	}
];

// Creating a signer. This is for making state changes to the block chain.
const wallet = ethers.wallet.fromMnemonic(seedPhrase);

const Charged = new Charged({providers: mySpecialProviders, signer: wallet});
// Now we are ready to read and write to the block chain.
```

### Interacting with the protocol

When reading and/or writing you will need to define which NFT you are working with.

```jsx
/*
Before you call functions on a specific particle you'll need to specify which one 
you are going to work with.
*/

const contractAddress = '0x1234';
const tokenId = 33;

const nft = charged.NFT(contractAddress, tokenId);

// This energizes our nft with 47 DAI tokens.
const txReciept = await nft.energize('aave.B', '0xDAI', ethers.utils.parseEther('47'));

// Discharges all of the interest accrued by the DAI tokens to my wallet.
const txReceipt2 = await nft.discharge('0xMYADDRESS', 'aave.B', '0xDAI');
```

### Utilities

```jsx
// Utility functions will have this format.
// For example this fetches the address of a contract associated with the main contract.
const stateAddress = await charged.utils.getStateAddress()
```

# Application Programming Interface

The functions are documented within the tsdoc standard in the github repository. However, there will be more information here.

## NFT

### getMass

getMass(managerId, assetAddress) ⇒ BigNumber

Fetches the mass of the particle. 

```jsx
// My particle has 50 DAI tokens in it.

const massBN = await nft.getMass('aave.B', '0xDAI');
const mass = ethers.utils.formatUnits(massBN['insertChainId'].value);

console.log(mass)
// "50"
```

Contract: `chargedParticles`

Solidity Function Name: `baseParticleMass`

Signer Required: ❎

### getCharge

getCharge(managerId, assetAddress) ⇒ BigNumber

Fetches the charge of the particle. 

```jsx
// My particle has a charge of 5 DAI.

const chargeBN = await nft.getCharge('aave.B', '0xDAI');
const charge = ethers.utils.formatUnits(chargeBN['insertChainId'].value);

console.log(charge)
// "5"
```

Contract: chargedParticles

Solidity Function Name: `currentParticleCharge`

Signer Required: ❎

### getKinetics

Honestly don’t know what this do

### getBonds

getBonds(managerId) ⇒ BigNumber

Fetches the amount of bonds of the particle. 

```jsx
// My particle has a 16 NFTs bonded to it.

const bondsBN = await nft.getBonds('generic.B');
const bonds = ethers.utils.formatUnits(bondsBN['insertChainId'].value);

console.log(bonds)
// "16"
```

Contract: `chargedParticles`

Solidity Function Name: `currentParticleCovalentBonds`

Signer Required: ❎

### energize

energize(walletManagerId, assetAddress, assetAmount, chainId?, referrer?) ⇒ ContractTransaction

- walletManagerId: ManagerId
- assetAddress: string
- assetAmount: BigNumberish
- chainId: number ⇒ Optional parameter. Used when you have multiple providers and need to specify the network you wish to write to.
- referrer: string ⇒ Optional parameter. Don’t know

Returns `yieldTokensAmount` . The amount of Yield-bearing Tokens added to the escrow for the Token as a BigNumber

Energizes a particle. 

```jsx
// Energizing a particle with 25 DAI tokens.

const txReceipt = await nft.energize('aave.B', '0xDAI', ethers.utils.parseUnits("47"));

console.log(txReceipt)
// ...
```

If you are dealing with a gas limit revert issue this may be because you need to approve the token with the chargedParticles contract before energizing.

Contract: `chargedParticles`

Solidity Function Name: `energizeParticle`

Signer Required: ✅

### discharge

discharge(receiver, walletManagerId, assetToken, chainId?) ⇒ ContractTransaction

- receiver: string ⇒ address you wish to send interest to
- walletManagerId: ManagerId
- assetToken: string ⇒ address of asset
- chainId: number. Optional parameter. Used when you have multiple providers and need to specify the network you wish to write to.

Returns `creatorAmount`: *Amount of Asset Token discharged to the Creator as a BigNumber* and `receiverAmount` : *Amount of Asset Token discharged to the Receiver as a BigNumber*

Discharges the interest from a particle

```jsx
// Discharging a particle with 5 DAI of charge.

const txReceipt = await nft.discharge('0xMYWALLET', 'aave.B', '0xDAI');

console.log(txReceipt)
// ...
```

Contract: `chargedParticles`

Solidity Function Name: `dischargeParticle`

Signer Required: ✅

### dischargeAmount

dischargeAmount(receiver, walletManagerId, assetToken, assetAmount, chainId?) ⇒ ContractTransaction

- receiver: string ⇒ address you wish to send interest to
- walletManagerId: ManagerId
- assetToken: string ⇒ address of asset
- assetAmount: BigNumberish
- chainId: number. Optional parameter. Used when you have multiple providers and need to specify the network you wish to write to.

Returns `creatorAmount`: *Amount of Asset Token discharged to the Creator as a BigNumber* and `receiverAmount` : *Amount of Asset Token discharged to the Receiver as a BigNumber*

Discharges X amount of interest from a particle

```jsx
// Discharging 5 DAI from a particle with 18 DAI of charge.

const txReceipt = await nft.dischargeAmount(
	'0xMYWALLET', 
	'aave.B', 
	'0xDAI', 
	ethers.utils.parseUnits("5")
);

console.log(txReceipt)
// ...
```

Contract: `chargedParticles`

Solidity Function Name: `dischargeParticleAmount`

Signer Required: ✅

### dischargeForCreator

dischargeForCreator(receiver, walletManagerId, assetToken, assetAmount, chainId?) ⇒ ContractTransaction

- receiver: string ⇒ address you wish to send interest to
- walletManagerId: ManagerId
- assetToken: string ⇒ address of asset
- assetAmount: BigNumberish
- chainId: number. Optional parameter. Used when you have multiple providers and need to specify the network you wish to write to.

Returns `receiverAmount` : *Amount of Asset Token discharged to the Receiver as a BigNumber*

Discharges X amount of interest from a particle for the creator

```jsx
// Discharging 5 DAI from a particle with 18 DAI of charge.

const txReceipt = await nft.dischargeForCreator(
	'0xMYWALLET', 
	'aave.B', 
	'0xDAI', 
	ethers.utils.parseUnits("5")
);

console.log(txReceipt)
// ...
```

Contract: `chargedParticles`

Solidity Function Name: `dischargeParticleForCreator`

Signer Required: ✅

### release

release(receiver, walletManagerId, assetToken, chainId?) ⇒ ContractTransaction

- receiver: string ⇒ address you wish to send interest to
- walletManagerId: ManagerId
- assetToken: string ⇒ address of asset
- chainId: number. Optional parameter. Used when you have multiple providers and need to specify the network you wish to write to.

Returns `creatorAmount`: *Amount of Asset Token discharged to the Creator as a BigNumber* and `receiverAmount` : *Amount of Asset Token discharged to the Receiver (includes principalAmount) as a BigNumber*

Releases all X tokens from the particle

```jsx
// Releases all DAI from the particle back to my wallet

const txReceipt = await nft.release(
	'0xMYWALLET', 
	'aave.B', 
	'0xDAI',
);

console.log(txReceipt)
// ...
```

Contract: `chargedParticles`

Solidity Function Name: `releaseParticle`

Signer Required: ✅

### releaseAmount

releaseAmount(receiver, walletManagerId, assetToken, assetAmount, chainId?) ⇒ ContractTransaction

- receiver: string ⇒ address you wish to send interest to
- walletManagerId: ManagerId
- assetToken: string ⇒ address of asset
- assetAmount: BigNumberish
- chainId: number. Optional parameter. Used when you have multiple providers and need to specify the network you wish to write to.

Returns `creatorAmount`: *Amount of Asset Token discharged to the Creator as a BigNumber* and `receiverAmount` : *Amount of Asset Token discharged to the Receiver (includes principalAmount) as a BigNumber*

Releases X amount of Y tokens from the particle

```jsx
// Releases 5 DAI from the particle back to my wallet

const txReceipt = await nft.releaseAmount(
	'0xMYWALLET', 
	'aave.B', 
	'0xDAI', 
	ethers.utils.parseUnits("5")
);

console.log(txReceipt)
// ...
```

Contract: `chargedParticles`

Solidity Function Name: `releaseParticleAmount`

Signer Required: ✅

### bond

bond(basketManagerId, nftTokenAddress, nftTokenId, nftTokenAmount, chainId?) ⇒ ContractTransaction

- basketManagerId: string
- nftTokenAddress: string
- nftTokenId: string
- nftTokenAmount: string
- chainId: number. Optional parameter. Used when you have multiple providers and need to specify the network you wish to write to.

Returns `success` as a bool

Covalent bonds an NFT to your particle. If the NFT is type ERC1155 then you can bond more than one.

```jsx
// Bonds 3 ERC1155 SuperApe nfts to the particle

const txReceipt = await nft.bond(
	'generic.B', 
	'0xSUPERAPENFTS', 
	ethers.utils.parseUnits('45'), 
	ethers.utils.parseUnits('3')
);

console.log(txReceipt)
// ...
```

Contract: `chargedParticles`

Solidity Function Name: `covalentBond`

Signer Required: ✅

### breakBond

breakBond(receiver, basketManagerId, nftTokenAddress, nftTokenId, nftTokenAmount, chainId?) ⇒ ContractTransaction

- receiver: string
- basketManagerId: string
- nftTokenAddress: string
- nftTokenId: string
- nftTokenAmount: string
- chainId: number. Optional parameter. Used when you have multiple providers and need to specify the network you wish to write to.

Returns `success` as a bool

Breaks covalent bonds from your particle. If the NFT is type ERC1155 then you can break a specific amount of bonds.

```jsx
// Breaks bond of 3 ERC1155 SuperApe nfts and releases them back to my wallet

const txReceipt = await nft.breakBond(
	'0xMYWALLET',
	'generic.B', 
	'0xSUPERAPENFTS', 
	ethers.utils.parseUnits('45'), 
	ethers.utils.parseUnits('3')
);

console.log(txReceipt)
// ...
```

Contract: `chargedParticles`

Solidity Function Name: `breakCovalentBond`

Signer Required: ✅

## Utilities

### getStateAddress

getStateAddress() ⇒ String

```jsx
// Gets the chargedState contract address from all of the supplied provider's network
// Assume we have passed in providers for network: 1, 42, and 137

const stateAddress = await charged.utils.getStateAddress();

console.log(stateAddress);
/*
{
	1: {
		value: '0xMAINNETSTATEADDY',
		status: 'fulfilled',
	},
	42: {
		value: '0xKOVANSTATEADDY',
		status: 'fulfilled',
	},
	137: {
		value: '0xPOLYGONSTATEADDY',
		status: 'fulfilled',
	},
}
*/
```

Contract: `chargedParticles` 

Solidity Function Name: `getStateAddress`

Signer Required: ❎

### getSettingsAddress

getSettingsAddress() ⇒ String

```jsx
// Gets the chargedSettings contract address from all of the supplied provider's network
// Assume we have passed in providers for network: 1, 42, and 137

const settingsAddress = await charged.utils.getSettingsAddress();

console.log(settingsAddress);
/*
{
	1: {
		value: '0xMAINNETSTATEADDY',
		status: 'fulfilled',
	},
	42: {
		value: '0xKOVANSTATEADDY',
		status: 'fulfilled',
	},
	137: {
		value: '0xPOLYGONSTATEADDY',
		status: 'fulfilled',
	},
}
*/
```

Contract: `chargedParticles` 

Solidity Function Name: `getSettingsAddress`

Signer Required: ❎

### getManagersAddress

getManagersAddress() ⇒ String

```jsx
// Gets the chargedManagers contract address from all of the supplied provider's network
// Assume we have passed in providers for network: 1, 42, and 137

const managersAddress = await charged.utils.getStateAddress();

console.log(managersAddress);
/*
{
	1: {
		value: '0xMAINNETSTATEADDY',
		status: 'fulfilled',
	},
	42: {
		value: '0xKOVANSTATEADDY',
		status: 'fulfilled',
	},
	137: {
		value: '0xPOLYGONSTATEADDY',
		status: 'fulfilled',
	},
}
*/
```

Contract: `chargedParticles` 

Solidity Function Name: `getManagersAddress`

Signer Required: ❎

### getFeesForDeposit

getFeesForDeposit() ⇒ BigNumber

‼️ Currently there are no fees with the Charged Particles protocol (6/9/22) ‼️

```jsx
// Gets the deposit fees of the protocol
// Assume we have passed in providers for network: 1, and 42

const fees = await charged.utils.getStateAddress();

console.log(fees);
/*
{
	1: {
		value: { BIGNUMBER_OBJECT },
		status: 'fulfilled',
	},
	42: {
		value: { BIGNUMBER_OBJECT },
		status: 'fulfilled',
	}
}
*/
```

Contract: `chargedParticles` 

Solidity Function Name: `getFeesForDeposit`

Signer Required: ❎

# Advanced Use

The SDK’s core use was built around certain work flows but we understand the need to go above and beyond.  You can import all of our contract ABIs, and the addresses of said contracts on all of our supported networks.

You can see what contract and functions the SDK methods are utilizing in the documentation above.

*(B) means we provide the non-B and B versions aka V1 and V2 respectively*

ABIs Provided:

- chargedParticles
- chargedSettings
- chargedState
- chargedManagers
- proton(B)
- aaveWalletManager(B)
- genericWalletManager(B)
- genericBasketManager(B)

We also provide the contract locations (address + start block) for: Mainnet, Kovan, Polygon, Mumbai

## Example Usage

TODO: package name may change

```jsx
import { ethers } from 'ethers';
import { abisAndNetworks } from 'charged-sdk';

const contract = new ethers.Contract(
	abisAndNetworks.mainnet.chargedParticles.address,
	abisAndNetworks.chargedParticles,
	ethers.getDefaultProvider()
);

const result = contract.getStateAddress();
console.log(result);
// 0x48974C6ae5A0A25565b0096cE3c81395f604140f
console.log(result == abisAndNetworks.mainnet.chargedState.address);
// true
```

### Network Object Structure

When looking for the contract’s address you will need to specify network, contract name, and then address or start block.

```jsx
mainnet {
	chargedParticles: {
		address: 'xxx',
		startBlock: 'xxx',
	}
	// all supported abis will be in each network
}
```

# Common Issues/FAQ

### Why do write functions take so long?

State changing functions such as `energize()` wait for at least one confirmation before returning as to avoid issues with reusing account nonces.

# Types

### ManagerId

accepted values: `aave`, `aave.B`, `generic`, `generic.B`

this values represent the manager id.

- `aave` is the V1 manager for aave tokens
- `aave.B` is the V2 manager for aave tokens
- `generic` is the V1 manager for non-interest bearing erc20s and nfts
- `generic.B` is the V2 manager for the non-interest bearing erc20s and nfts

### ContractTransaction

See [https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt](https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt)

### BigNumberish

See [https://docs.ethers.io/v5/api/utils/bignumber/#BigNumberish](https://docs.ethers.io/v5/api/utils/bignumber/#BigNumberish)