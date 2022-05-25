import { ethers } from 'ethers';

export type MultiProvider = ethers.providers.JsonRpcProvider | 
ethers.providers.BaseProvider |
ethers.providers.AlchemyProvider | 
ethers.providers.InfuraProvider | 
ethers.providers.EtherscanProvider |
ethers.providers.CloudflareProvider |
ethers.providers.PocketProvider | 
ethers.providers.AnkrProvider;

export type MultiSigner = ethers.VoidSigner |
ethers.Wallet |
ethers.providers.JsonRpcSigner;