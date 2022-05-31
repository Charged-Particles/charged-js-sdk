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

export const rpcUrlMainnet = getParamOrExit('RPC_URL_MAINNET');

export const rpcUrlKovan = getParamOrExit('RPC_URL_KOVAN');

export const SUPPORTED_NETWORKS = [
  {chainId:     1, chainName: 'eth', name: 'Ethereum'},
  {chainId:    42, chainName: 'kovan', name: 'Ethereum (Kovan)'},
  {chainId:   137, chainName: 'polygon', name: 'Polygon'},
  {chainId: 80001, chainName: 'mumbai',  name: 'Polygon (Mumbai)'},
];