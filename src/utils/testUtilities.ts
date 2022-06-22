import { ethers, providers, utils } from 'ethers';
import { MNEMONIC, rpcUrlKovan } from './config';
import BaseService from '../charged/services/baseService';

export const ethersProvider = new ethers.providers.JsonRpcProvider(rpcUrlKovan);

export const getSigner = () => {
  const walletMnemonic = ethers.Wallet.fromMnemonic(MNEMONIC)
  return walletMnemonic.connect(ethersProvider)
};

export const getWallet = () => {
  return ethers.Wallet.fromMnemonic(MNEMONIC)
};

export const getConnectedWallet = (provider: providers.Provider) => {
  const wallet = ethers.Wallet.fromMnemonic(MNEMONIC)
  return wallet.connect(provider)
};

export const getAddressFromSigner = () => {
  return getSigner().address;
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

export const sendTx = (
  transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>
) => {
  const signer = getSigner();
  return signer.sendTransaction(transaction);
};

export const signText = (text: string) => {
  return getSigner().signMessage(text);
};

export const contractMocks = (jest: any) => {
  const writeContractMock = jest
    .spyOn(BaseService.prototype, 'writeContract')
    .mockImplementation((contractName:string, methodName:string, network:string) => {
      if (!contractName || !methodName || !network) { Promise.reject('missing required parameters') }
      return (Promise.resolve({ wait: () => true }));
    });

  const readContractMock = jest
    .spyOn(BaseService.prototype, 'readContract')
    .mockImplementation((contractName:string, methodName:string, network:string) => {
      if (!contractName || !methodName || !network) { Promise.reject('missing required parameters') }
      return (Promise.resolve('success'));
    });

  return {writeContractMock, readContractMock};
};