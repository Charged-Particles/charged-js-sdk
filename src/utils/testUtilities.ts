import { ethers, providers, utils } from 'ethers';
import { MNEMONIC, rpcUrlKovan } from './config';

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

export const fakeReadContract = (contractName: string, methodName: string, network: number) => {
  if (!contractName || !methodName || !network) { Promise.reject('missing required parameters') }
  return (Promise.resolve('success'));
}