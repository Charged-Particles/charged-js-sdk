// import { RPC_URL, MNEMONIC } from './config';
// import { getAddressFromSigner } from "./ethers.service";
import { getStateAddress } from "./ChargedParticles";

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }

  console.log(getStateAddress());
  return a + b;
};

