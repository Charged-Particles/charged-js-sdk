Some of the integration tests relay on a local testnet to be run.

Todo so, we need to instantiate the local chain before running those tests.

If the chain is not running, tests that depend on that chain will fail.


1. `yarn install`

2. `yarn ganache-cli -f https://eth-kovan.alchemyapi.io/v2/API_KEY@32319500`

3. `yarn test --no-cache`