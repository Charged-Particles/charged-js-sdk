# @charged-aprticles/charged-js-sdk
Charged Particles Javascript SDK v0.1.7 (beta)

### Table of Contents

*   [Charged][19]
    *   [Parameters][20]
    *   [Examples][21]
    *   [ChargedConstructor][22]
        *   [Properties][23]
*   [NFT][24]
    *   [Parameters][25]
    *   [Examples][26]
    *   [getMass][27]
        *   [Parameters][28]
    *   [getCharge][29]
        *   [Parameters][30]
    *   [getKinectics][31]
        *   [Parameters][32]
    *   [getBonds][33]
        *   [Parameters][34]
    *   [getCreatorAnnuities][35]
    *   [getCreatorAnnuitiesRedirect][36]
    *   [tokenURI][37]
    *   [getDischargeState][38]
        *   [Parameters][39]
    *   [getReleaseState][40]
        *   [Parameters][41]
    *   [getBondsState][42]
        *   [Parameters][43]
    *   [energize][44]
        *   [Parameters][45]
        *   [Examples][46]
    *   [discharge][47]
        *   [Parameters][48]
        *   [Examples][49]
    *   [dischargeAmount][50]
        *   [Parameters][51]
    *   [dischargeForCreator][52]
        *   [Parameters][53]
    *   [release][54]
        *   [Parameters][55]
        *   [Examples][56]
    *   [releaseAmount][57]
        *   [Parameters][58]
    *   [bond][59]
        *   [Parameters][60]
        *   [Examples][61]
    *   [breakBond][62]
        *   [Parameters][63]
        *   [Examples][64]
    *   [releaseTimelock][65]
        *   [Parameters][66]
    *   [dischargeTimelock][67]
        *   [Parameters][68]
    *   [bondsTimelock][69]
        *   [Parameters][70]
    *   [setCreatorAnnuities][71]
        *   [Parameters][72]
    *   [setCreatorAnnuitiesRedirect][73]
        *   [Parameters][74]
*   [Types][1]
    *   [NetworkProvider][2]
        *   [Properties][3]
        *   [Examples][4]
    *   [ManagerId][5]
        *   [Properties][6]
    *   [ConfigurationParameters][7]
        *   [Properties][8]
    *   [SdkConfiguration][9]
        *   [Properties][10]
    *   [TransactionOverride][11]
        *   [Properties][12]
*   [Utilities][13]
    *   [Examples][14]
    *   [getStateAddress][15]
    *   [getSettingsAddress][16]
    *   [getManagersAddress][17]
    *   [getFeesForDeposit][18]


## Charged

### Parameters

*   `params` **ChargedConstructor** Charged parameter object.

### Examples

```javascript
const charged = new Charged({providers: window.ethereum});
const allStateAddresses = await charged.utils.getStateAddress();

const polygonProvider = [
 {
   network: 137,
   service: {alchemy: process.env.ALCHEMY_POLYGON_KEY}
 }
];
const charged = new Charged({providers: polygonProvider})
```

### ChargedConstructor

Charged class constructor object parameter.

Type: [Object][75]

#### Properties

*   `providers` **([Array][80]\<NetworkProvider> | providers.Provider | providers.ExternalProvider)?** Provider for connection to the Ethereum network.
*   `signer` **Signer?** Needed to send signed transactions to the Ethereum Network to execute state changing operations.
*   `config` **ConfigurationParameters**

## NFT

### Parameters

*   `contractAddress` **[string][77]**
*   `tokenId` **[number][76]**

### Examples

```javascript
const charged = new Charged({providers: window.ethereum});

const nft = charged.NFT( '0xd1bce91a13089b1f3178487ab8d0d2ae191c1963', 43);

const creatorAnnuities = await nft.getCreatorAnnuities();
```

Returns **NftService** Instance of the NFT connected to the charged particle protocol

### getMass

Gets the amount of asset tokens that have been deposited into the Particle.

#### Parameters

*   `walletManagerId` **ManagerId** The ID of the wallet manager to check.
*   `assetToken` **[string][77]** The address of the asset token to check.

Returns **BigNumber** The Amount of underlying assets held within the token.

### getCharge

Gets the amount of interest that the particle has generated.

#### Parameters

*   `walletManagerId` **ManagerId** The ID of the Wallet Manager.
*   `assetToken` **[string][77]** The address of the asset Token to check.

Returns **BigNumber** The amount of interest generated.

### getKinectics

Gets the amount of LP Tokens that the Particle has generated.

#### Parameters

*   `walletManagerId` **ManagerId** The ID of the Wallet Manager.
*   `assetToken` **[string][77]** The Address of the Asset Token to check.

Returns **BigNumber** The amount of LP tokens that have been generated.

### getBonds

Gets the total amount of ERC721 tokens that the Particle holds.

#### Parameters

*   `basketManagerId` **[string][77]** The ID of the BasketManager to check.

Returns **BigNumber** The total amount of ERC721 tokens that are held within the Particle.

### getCreatorAnnuities

Gets the amount of creator annuities reserved for the creator for the specified NFT.

Returns **address** The address of the creator.

Returns **[number][76]** The percentage amount of annuities reserved for the creator.

### getCreatorAnnuitiesRedirect

Get the address that receives creator annuities for a given Particle/ Defaults to creator address if it has not been redirected.

Returns **address** The address of the creator.

Returns **[number][76]** The percentage amount of annuities reserved for the creator.

### tokenURI

Gets the tokenUri using the tokenId and contractAddress of the Particle.

Returns **[string][77]** Token metadata URI.

### getDischargeState

Gets the Discharge timelock state of the Particle.

#### Parameters

*   `sender` **[string][77]** The address approved for Discharging assets from the Particle.

Returns **\[[boolean][78], [boolean][78], BigNumber, BigNumber]** \[allowFromAll, isApproved, timelock, empLockExpiry]

### getReleaseState

Gets the Discharge timelock state of the Particle.

#### Parameters

*   `sender` **[string][77]** The address approved for Releasing assets from the Particle.

Returns **\[[boolean][78], [boolean][78], BigNumber, BigNumber]** \[allowFromAll, isApproved, timelock, empLockExpiry]

### getBondsState

Gets the Bonds Timelock state of the Particle.

#### Parameters

*   `sender` **[string][77]** The address approved for removing Bond assets from the Particle.

Returns **[boolean][78]** allowFromAll

Returns **[boolean][78]** isApproved

Returns **BigNumber** timelock

Returns **BigNumber** empLockExpiry

### energize

Fund particle with asset token
Must be called by the account providing the asset. Account must also approve THIS contract as operator as asset.

If you are getting gas limit errors this may be because you forgot to approve the contract as operator of asset

#### Parameters

*   `walletManagerId` **ManagerId** The Asset-Pair to Energize the Token with
*   `assetToken` **[string][77]** The Address of the Asset Token being used
*   `assetAmount` **BigNumberish** The Amount of Asset Token to Energize the Token with
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to
*   `referrer` **[string][77]?**

#### Examples

```javascript
// Asset amount expects a big numberish type. If you do not supply a
// big number object, ethers will assume you are working in wei.
// Deposits 20 USDC tokens into our particle that will accrue interest.

const USDCoinAddress = '0xUSDC';
const result = await nft.energize(
  'aave.B',
  USDCoinAddress,
  ethers.utils.parseUnits("20", 6),
);
// Or, deposit assets that will not accrue interest
// or assets that are not supported by our yield generating protocols (e.g. aave)

// For example, we will energize our particle with 20 monkey coins
// This will not generate interest.
const monkeyCoinAddress = '0xMONKEY';
const result = await nft.energize(
  'generic.B',
  monkeyCoinAddress,
  ethers.utils.parseUnits("20")
);
```

Returns **[Promise][81]\<ContractTransaction>** A contract receipt from the transaction.[Solidity Contract Method][82]

### discharge

Allows the owner or operator of the token to collect or transfer the interest generated from the token
without removing the underlying asset that is held within the token.

#### Parameters

*   `receiver` **[string][77]** The address to receive the discharged asset tokens.
*   `walletManagerId` **ManagerId** The wallet manager of that assets to discharge from the token.
*   `assetToken` **[string][77]** The address of the asset token being discharged.
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to.j

#### Examples

```javascript
const myWallet = '0xWALLET';
const rocketPoolAddress = '0xRPL';
const result = await nft.discharge(
  myWallet,
  'aave.B',
  rocketPoolAddress,
);

// You can also discharge to any arbitrary wallet!
// Let's send all of our interest accrued by our DAI to Vitalik.
const vitaliksWallet = '0xCOOLGUY';
const daiAddress = '0xDAI';
const result = await nft.discharge(
  vitaliksWallet,
  'aave.B',
  daiAddress,
)
```

Returns **[Promise][81]\<ContractTransaction>** A receipt from the contract transaction.[Solidity Contract Method][83]

### dischargeAmount

Allows the owner or operator of the Token to collect or transfer a specific amount of the interest
generated from the token without removing the underlying Asset that is held within the token.

#### Parameters

*   `receiver` **[string][77]** The address to receive the discharged asset tokens.
*   `walletManagerId` **ManagerId** The wallet manager of the assets to discharge from the token.
*   `assetToken` **[string][77]** The address of the asset token being discharged.
*   `assetAmount` **BigNumberish** The specific amount of asset token to discharge from the particle.
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to.

Returns **[Promise][81]\<ContractTransaction>** Details from the transaction.[Solidity Contract Method][84]

### dischargeForCreator

Allows the Creator of the Token to collect or transfer a their portion of the interest (if any)
generated from the token without removing the underlying Asset that is held within the token.

#### Parameters

*   `receiver` **[string][77]** The address to receive the discharged asset tokens
*   `walletManagerId` **ManagerId** The wallet manager of the assets to discharge from the token
*   `assetToken` **[string][77]** The address of the asset token being discharged
*   `assetAmount` **BigNumberish** The specific amount of asset token to discharge from the particle
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to

Returns **[Promise][81]\<ContractTransaction>** A receipt from the transaction[Solidity Contract Method][85]

### release

Releases the full amount of asset + interest held within the particle by LP of the assets.
To release NFT assets from your particle, see [break bond][86].

#### Parameters

*   `receiver` **[string][77]** The address to receive the released asset tokens.
*   `walletManagerId` **ManagerId** The wallet manager of the assets to release from the token.
*   `assetToken` **[string][77]** The address of the asset token being released.
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to.

#### Examples

```javascript
// Release the DAI from our particle. Withdraws the interest (if any) as well!
const receiver = '0xMYWALLET';
const daiAddress = '0xDAI';
const result = nft.release(
  receiver,
  'aave.B',
  daiAddress,
);
```

Returns **[Promise][81]\<ContractTransaction>** Details from the transaction.[Solidity Contract Method][87]

### releaseAmount

Releases a partial amount of asset + interest held within the particle by LP of the assets.

#### Parameters

*   `receiver` **[string][77]** The address to receive the released asset tokens
*   `walletManagerId` **ManagerId** The wallet manager of the assets to release from the token
*   `assetToken` **[string][77]** The address of the asset token being released
*   `assetAmount` **BigNumberish** The specific amount of asset token to release from the particle
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to

Returns **[Promise][81]\<ContractTransaction>** A receipt from the transaction[Solidity Contract Method][88]

### bond

Deposit other NFT assets into the particle.
Must be called by the account providing the asset. Account must approve THIS contract as operator of asset.

#### Parameters

*   `basketManagerId` **[string][77]** The basket to deposit the NFT into.
*   `nftTokenAddress` **[string][77]** The address of the NFT token being deposited.
*   `nftTokenId` **[string][77]** The ID of the NFT token being deposited.
*   `nftTokenAmount` **[number][76]** The amount of tokens to deposit (ERC1155-specific).
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to.

#### Examples

```javascript
const nftTokenAddress = '0xMOONBIRDS';
const tokenId = '12';
const result = await nft.bond(
  'generic.B',
  nftTokenAddress,
  tokenId,
  1,
);

// We have 12 erc-1155 nfts that we want to bond to the particle.
const nftTokenAddress = '0xCOOLGAME';
const tokenId = '78';
const result = await nft.bond(
  'generic.B',
  nftTokenAddress,
  tokenId,
  12
);
```

Returns **[Promise][81]\<ContractTransaction>** Details from the transaction.[Solidity Contract Method][89]

### breakBond

Release NFT assets from the particle.

#### Parameters

*   `receiver` **[string][77]** The address to receive the released asset tokens.
*   `basketManagerId` **[string][77]** The basket to release the NFT from.
*   `nftTokenAddress` **[string][77]** The address of the NFT token being released.
*   `nftTokenId` **[string][77]** The ID of the NFT token being released.
*   `nftTokenAmount` **[Number][76]** The amount of tokens to deposit (ERC1155-specific).
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to.

#### Examples

```javascript
// We bonded 14 erc-1155 nfts to our particle. We want to release 3.
// When working with erc-721 use 1 for nftTokenAmount.
const receiver = '0xMYWALLET';
const nftTokenAddress = '0xNFTS';
const tokenId = '35';
const result = await nft.breakBond(
  receiver,
  'generic.B',
  nftTokenAddress,
  tokenId,
  3
);
```

Returns **[Promise][81]\<ContractTransaction>** Details from the transaction.[Solidity Contract Method][90]

### releaseTimelock

Sets a timelock on the ability to release the assets of a particle.

#### Parameters

*   `unlockBlock` **[number][76]** The Ethereum block number to timelock until (~15 seconds per block).
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to.

Returns **[Promise][81]\<ContractTransaction>** Details from the transaction.[Solidity Contract Method][91]

### dischargeTimelock

Sets a timelock on the ability to discharge the assets of a particle

#### Parameters

*   `unlockBlock` **[number][76]** The Ethereum block number to timelock until (~15 seconds per block).
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to.

Returns **[Promise][81]\<ContractTransaction>** Details from the transaction.[Solidity Contract Method][92]

### bondsTimelock

Sets a timelock on the ability to break the covalent bond of a particle

#### Parameters

*   `unlockBlock` **[number][76]** The Ethereum block number to timelock until (~15 seconds per block).
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to.

Returns **[Promise][81]\<ContractTransaction>** Details from the transaction.[Solidity Contract Method][93]

### setCreatorAnnuities

Sets the custom configuration for creators of proton-based NFTs
Must be called by account that created and owns the particle

#### Parameters

*   `creator` **[string][77]** The creator's address of the proton-based NFT.
*   `annuityPercent` **BigNumberish** The percentage of interest-annuities to reserve for the creator. In decimal this can range from 0 - 10000. 5712 would be 57.12%..
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to.

Returns **[Promise][81]\<ContractTransaction>** Details from the transaction.[Solidity Contract Method][94]

### setCreatorAnnuitiesRedirect

Sets a custom receiver address for the creator annuities
Must be called by account that created and owns the particle

#### Parameters

*   `receiver` **[string][77]** The receiver of the creator interest annuities.
*   `chainId` **[number][76]?** Optional parameter that allows for the user to specify which network to write to.

Returns **[Promise][81]\<ContractTransaction>** Details from the transaction.[Solidity Contract Method][95]

## Utilities

### Examples

```javascript
const charged = new Charged({providers: window.ethereum});
const creatorAnnuities = await charged.utils.getStateAddress();
```

Returns **UtilsService**

### getStateAddress

Get the address of the chargedState contract.

Returns **[string][77]** state contract address

### getSettingsAddress

Get the address of the chargedSettings contract.

Returns **[string][77]** settings contract address

### getManagersAddress

Get the address of the chargedManagers contract.

Returns **[string][77]** manager contract address

## Types

### NetworkProvider

User specified custom network provider.

Type: [Object][75]

#### Properties

*   `network` **[number][76]?** Configure the SDK.

#### Examples

```javascript
const providers = [
   {
     network: 1,
     service: { 'alchemy': process.env.ALCHEMY_MAINNET_KEY }
   },
   {
     network: 42,
     service: { 'infura': process.env.INFURA_KOVAN_KEY }
   }
 ];

const rpcUrlProvider = [
  {
     network: 42,
     service: { 'rpc': `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_SECRET}`}
   }
 ];
```

### ManagerId

A string enum that identifies which wallet manager to use. Used in functions like `release` and `discharge`

Type: ManagerId

#### Properties

*   `ManagerId` **[string][77]** possible values: `aave`, `aave.B`, `generic`, `generic.B`

### ConfigurationParameters

Charged class constructor object parameter.

Type: [Object][75]

#### Properties

*   `sdk` **SdkConfiguration?** Configure the SDK.
*   `transactionOverride` **TransactionOverride?** Override transaction default values.

### SdkConfiguration

SDK configuration.

Type: [Object][75]

#### Properties

*   `NftBridgeCheck` **[boolean][78]?** Verifies that the signer network matches the chainId of the contract interaction.

### TransactionOverride

Overrides [ethers transaction][79] default parameters.

Type: [Object][75]

#### Properties

*   `from` **[boolean][78]?**
*   `value` **[boolean][78]?**
*   `gasPrice` **[boolean][78]?**
*   `gasLimit` **[boolean][78]?**
*   `blockTag` **[boolean][78]?**
*   `nonce` **[boolean][78]?**


### getFeesForDeposit

Get the deposit fee of the protocol.

Returns **[string][77]** protocol fee amount.

[1]: #types

[2]: #networkprovider

[3]: #properties

[4]: #examples

[5]: #managerid

[6]: #properties-1

[7]: #configurationparameters

[8]: #properties-2

[9]: #sdkconfiguration

[10]: #properties-3

[11]: #transactionoverride

[12]: #properties-4

[13]: #utilities

[14]: #examples-1

[15]: #getstateaddress

[16]: #getsettingsaddress

[17]: #getmanagersaddress

[18]: #getfeesfordeposit

[19]: #charged

[20]: #parameters

[21]: #examples-2

[22]: #chargedconstructor

[23]: #properties-5

[24]: #nft

[25]: #parameters-1

[26]: #examples-3

[27]: #getmass

[28]: #parameters-2

[29]: #getcharge

[30]: #parameters-3

[31]: #getkinectics

[32]: #parameters-4

[33]: #getbonds

[34]: #parameters-5

[35]: #getcreatorannuities

[36]: #getcreatorannuitiesredirect

[37]: #tokenuri

[38]: #getdischargestate

[39]: #parameters-6

[40]: #getreleasestate

[41]: #parameters-7

[42]: #getbondsstate

[43]: #parameters-8

[44]: #energize

[45]: #parameters-9

[46]: #examples-4

[47]: #discharge

[48]: #parameters-10

[49]: #examples-5

[50]: #dischargeamount

[51]: #parameters-11

[52]: #dischargeforcreator

[53]: #parameters-12

[54]: #release

[55]: #parameters-13

[56]: #examples-6

[57]: #releaseamount

[58]: #parameters-14

[59]: #bond

[60]: #parameters-15

[61]: #examples-7

[62]: #breakbond

[63]: #parameters-16

[64]: #examples-8

[65]: #releasetimelock

[66]: #parameters-17

[67]: #dischargetimelock

[68]: #parameters-18

[69]: #bondstimelock

[70]: #parameters-19

[71]: #setcreatorannuities

[72]: #parameters-20

[73]: #setcreatorannuitiesredirect

[74]: #parameters-21

[75]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[76]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[77]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[78]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[79]: https://docs.ethers.io/v5/api/contract/contract/#Contract--metaclass

[80]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[81]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[82]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedParticles.sol#L267

[83]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedParticles.sol#L310

[84]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedParticles.sol#L351

[85]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedParticles.sol#L393

[86]: #breakBond

[87]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedParticles.sol#L440

[88]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedParticles.sol#L483

[89]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedParticles.sol#L533

[90]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedParticles.sol#L570

[91]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedState.sol#L440

[92]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedState.sol#L406

[93]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedState.sol#L474

[94]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedSettings.sol#L200

[95]: https://github.com/Charged-Particles/charged-particles-universe/blob/a2c54a8b125e416ff600b731d2d13576223bfac7/contracts/ChargedSettings.sol#L218
