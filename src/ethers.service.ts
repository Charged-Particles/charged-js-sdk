import { ethers, utils } from 'ethers';
import { RPC_URL, MNEMONIC } from './config';

export const ethersProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

export const getSigner = () => {
  const walletMnemonic = ethers.Wallet.fromMnemonic(MNEMONIC)
  return walletMnemonic.connect(ethersProvider)
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