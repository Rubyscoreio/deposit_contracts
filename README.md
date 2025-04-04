# RubyScore Deposit Contracts

This repo will have a code of RubyScore Deposit Contracts.

## Actual deployments
### On mainnets
| Chain    | Address                                    |
|----------|--------------------------------------------|
| Arbitrum | 0x7837371CB890D076E8Df558EabC9d78E112CC5ec |
| Base     | 0xdb0F28c9F7d0f33B04D2a8ea24391A1527876D8B |
| Linea    | 0xAF75cD51090E52Ca54Da17F40C06B5fC40b4445C |
| Manta    | 0xc0b05c668a5576A39c12089Ff1Cbc86AbA6B073a |
| Morph    | 0xF57Cb671D50535126694Ce5Cc3CeBe3F32794896 |
| Optimism | 0x9Dfd911486c3162195484f0B031fbb41617B2987 |
| Scroll   | 0xAB4EE3E9A48057bCfB2fBc8872Dcf0273C115E49 |
| Soneium  | 0xDC3D8318Fbaec2de49281843f5bba22e78338146 |
| Taiko    | 0x6eD14BbE16eBcfCA09762357530000Ba64a77372 |
| zkEVM    | 0x972e5bA0072f5cd1E91f3e477Dc0fe74E04CD4B7 |
| ZkSync   | 0x95048d754553CF74603D3888fc65149Ef9B22bE0 |
| Zora     | 0x5D893D3Ba8910a3c31ab6B999B9b0E7bC35460BE |

### On testnets
| Chain   | Address                                    |
|---------|--------------------------------------------|
| Monad   | 0xDC3D8318Fbaec2de49281843f5bba22e78338146 |
| Reddio  | 0xDC3D8318Fbaec2de49281843f5bba22e78338146 |
| Somnia  | 0xDC3D8318Fbaec2de49281843f5bba22e78338146 |
| Soneium | 0xbDB018e21AD1e5756853fe008793a474d329991b |
| MegaETH | 0xDC3D8318Fbaec2de49281843f5bba22e78338146 |

## Setting project

### Install dependencies

```sh
npm install
```

---

## config

```
DEPLOYER_KEY = ""
INFURA_KEY = ""
ETHERSCAN_API_KEY = ""
POLYGONSCAN_API_KEY = ""
BSCSCAN_API_KEY = ""
```

### Setup config

Create and fill _.env_ file.

```sh
cp .env.example .env
```

---

### Compile contracts

```sh
npm run compile
```

---

### Migrate contracts

```sh
npm run migrate:<NETWORK> (mainnet, goerli, polygon, polygonMumbai, bsc, bscTestnet)
```

---

### Verify contracts

To verify the contract, you must specify the names of the contracts for verification through "," WITHOUT SPACES

```sh
npm run verify:<NETWORK> <NAME_CONTRACT_FIRST>,<NAME_CONTRACT_SECOND>
```

---

### Tests contracts

```sh
# Run Tests
npm run test

# Run test watcher
npm run test:watch
```

---

### Node hardhat(Localfork)

NOTE:// To work with a node or fork, you need to run the node in a separate console

```sh
# Run Node hardhat (For run localfork setting config { FORK_ENABLED: true, FORK_PROVIDER_URI: "https://...."})
npm run node

# Run test watcher
npm run test:node
```

---

### Coverage

```sh
npm run coverage
```

---

### Gas reporter

You can start the gas reporter either through a separate gas reporter script through "**npm run**" or by changing the variable in the config "**GAS_REPORTER.ENABLED**" when running tests

```sh
# Native gas reporter
npm run gas-reporter

# GAS_REPORTER.ENABLED = true
npm run test
```

---

### Clean

```sh
# Rm artifacts, cache, typechain-types
npm run clean

# Rm deployments for choose network
npm run clean:deployments <NETWORK>
```

---

### Linter

```sh
# Checking code style for .ts, .sol
npm run lint

# Run fix code style for .ts, .sol
npm run lint:fix

# Checking code style for .ts
npm run lint:ts

# Run fix code style for .ts
npm run lint:ts:fix

# Checking code style for .sol
npm run lint:sol

# Run fix code style for .sol
npm run lint:sol:fix
```

---

## Auto audit with slither

To run the analyzer, you must first install it globally

To audit all contracts, use the command :

```sh
slither .
```

To exclude warnings in subsequent audits, use :

```sh
slither . --triage
```

---
