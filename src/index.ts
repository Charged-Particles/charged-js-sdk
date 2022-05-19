// import { RPC_URL, MNEMONIC } from './config';
import { getAddressFromSigner } from "./ethers.service";

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }

  console.log(getAddressFromSigner());
  return a + b;
};

