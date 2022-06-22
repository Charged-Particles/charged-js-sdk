Some of the integration tests relay on a local testnet to be run.

Todo so, we need to instantiate the local chain before running those tests.

If the chain is not running, tests that depend on that chain will fail.


1. `yarn install`

2. `yarn ganache-cli -f https://eth-mainnet.alchemyapi.io/v2/qw02QqWNMg2kby3q3N39PxUT3KaRS5UE@15008033`

3. `yarn test --no-cache`