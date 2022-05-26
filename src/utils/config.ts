import 'dotenv/config';

const getParamOrExit = (name: string) => {
  const param = process.env[name];

  if (!param) {
    console.error(`Required config param '${name}' missing`);
    process.exit(1);
  }

  return param;
};

export const MNEMONIC = getParamOrExit('MNEMONIC');
export const rpcUrlMain = getParamOrExit('RPC_URL_MAINNET');
export const rpcUrlKovan = getParamOrExit('RPC_URL_KOVAN');