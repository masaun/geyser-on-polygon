# Geyser on Polygon

***
## 【Introduction of the Geyser on Polygon】
- This is Geyser's smart contract on Polygon.
  - Geyser ( https://www.gysr.io/ ) is an open platform for yield farming and token distribution.
  - But, that is only deployed on Mainnet. Therefore, users need to pay high gas fees.
  - To solve this issue from users perspective, I deployed Geyser's smart contract on Polygon.

&nbsp;

***

## 【Workflow】
- Diagram of workflow

&nbsp;

***

## 【Remarks】
- Version for following the `Geyser` smart contract
  - Solidity (Solc): v0.6.11
  - Truffle: v5.1.60
  - web3.js: v1.2.9
  - openzeppelin-solidity: v3.2.0
  - ganache-cli: v6.9.1 (ganache-core: 2.10.2)


&nbsp;

***

## 【Setup】
### ① Install modules
- Install npm modules in the root directory
```
$ npm install
```

<br>

### ② Compile & migrate contracts
- on local
```
$ npm run migrate:local
```

- on Polygon (Matic) mumbai testnet
```
$ npm run migrate:polygon_testnet
```

<br>

## 【Script】on Polygon (Matic)
- ① Get API-key from Infura  
https://infura.io/


- ② Add `.env` to the root directory.
  - Please reference how to write from `.env.example` . (Please write 3 things below into `.env` )
    - MNEMONIC (Mnemonic)  
    - INFURA_KEY (Infura key)  
    - DEPLOYER_ADDRESS (Deployer address)  
      https://github.com/masaun/geyser-on-polygon/blob/main/.env.example

<br>

- ③ In advance, Please check `MATIC token balance` of `executor's wallet address` .
  - Idealy, MATIC tokens balance is more than `1 MATIC` .
  - Matic fancet: https://faucet.matic.network/ (Please select Mumbai network)

<br>

- ③ Execute script on `Polygon (Matic) mumbai testnet`
```
$ npm run script:Geyser
```

<br>

***

## 【References】
- Polygon (Matic)
  - Website: https://polygon.technology/
  - Doc: https://docs.matic.network/docs/develop/getting-started 
  - MATIC fancet：https://faucet.matic.network/
  - Network setting for MetaMask：https://github.com/masaun/tokenized-carbon-credit-marketplace#setup-wallet-by-using-metamask
  - Polygon (Open Defi Hackathon)：https://gitcoin.co/issue/maticnetwork/matic-bounties/20/100025642

<br>

- Geyser  
  - Website: https://www.gysr.io/  
  - Doc: https://www.gysr.io/docs  
  - Smart contract：https://github.com/gysr-io/core  
