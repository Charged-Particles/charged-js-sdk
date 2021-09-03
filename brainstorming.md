# 8/27

## Minimum Viable Product (Alpha)

- target devs for alpha
  - already comfortable with Web3 and/or Ethers
  - not your first Web3 Dapp project
  - Rarible / other NFT teams
  - Hackathon devs
  - people who want to enhance existing NFT projects / ideas

- must-have functions
  - **read NFT's wallet balance**

## Medium term goals
  - energize, withdraw, discharge

## Long-term goals

- use our own SDK for new dapps we develop as a core team
- deploy new custom contracts like Rarible
- implement our own SDK into our dapp in small steps?
  - SDK for homepage as first step?   

---

# 9/3

## Design Decisions

- Follow the OpenAPI standard: https://swagger.io/specification/
  - standard Schema and formatting
- Work in TypeScript (loosely typed at first, then create stricter typing as we go)
- how we want to install: `npm install @charged-particles/SDK`

// example calls -- for one-off calls
```
ChargedParticles.init(
  apiKey: xyz,
  rpcUrl: abc,
  wallet: wallet (signer, provider, chainId),
)

ChargedParticles.getMetadata(
  contractAddresses: String[]
  tokenIds: int[]
)
```

// hooks examples -- for watching / listening to data
```
import { useChargedParticles } from '@charged-particles/sdk';

//// IDEAS FOR POSSIBLE HOOKS ////

// useCPQuery ??
// other hooks
```

**Multicall vs the Subgraph**
- Multicall needed for Current Charge (interest)
- Subgraph can be used for metadata, Covalent Bonds, Principal amounts

**Homework**
- think about useful hooks
- think about what can come from the subgraph
