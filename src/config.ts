import 'dotenv/config';

const getParamOrExit = (name: string) => {
  const param = process.env[name];
  if (!param) {
    console.error(`Required config param '${name}' missing`);
    process.exit(1);
  }
  return param;
};

// const getParam = (name: string) => {
//   const param = process.env[name];
//   if (!param) {
//     return null;
//   }
//   return param;
// };

export const MNEMONIC = getParamOrExit('MNEMONIC');

export const RPC_URL = getParamOrExit('RPC_URL');

export const ALCHEMY_RPC_URL = getParamOrExit('ALCHEMY_API_KEY');