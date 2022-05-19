import { RPC_URL, PK } from './config';

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }

  console.log(RPC_URL, PK);

  return a + b;
};

