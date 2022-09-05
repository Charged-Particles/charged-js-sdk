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

export const infuraProjectId = getParamOrExit('INFURA_PROJECT_ID');

export const alchemyMainnetKey = getParamOrExit('ALCHEMY_MAINNET_KEY');

export const alchemyGoerliKey = getParamOrExit('ALCHEMY_GOERLI_KEY');

export const alchemyMumbaiKey = getParamOrExit('ALCHEMY_MUMBAI_KEY');

export const alchemyPolygonKey = getParamOrExit('ALCHEMY_POLYGON_KEY');

export const alchemyKovanKey = getParamOrExit('ALCHEMY_KOVAN_KEY');

export const alchemyPolygonRpcUrl = "https://polygon-{chainName}.g.alchemy.com/v2/{apiKey}";

export const alchemyEthereumRpcUrl = "https://eth-{chainName}.alchemyapi.io/v2/{apiKey}";

export const infuraPolygonRpcUrl = "https://polygon-{chainName}.infura.io/v3/{apiKey}";

export const infuraEthereumRpcUrl = "https://{chainName}.infura.io/v3/{apiKey}";

export const etherscanEthereumRpcUrl = "";