# Geyser on Polygon

***
## 【Introduction of the Geyser on Polygon】
- This is Geyser's smart contract on Polygon.
  - Geyser ( https://www.gysr.io/ ) is an open platform for yield farming and token distribution.
  - But, that is only deployed on Mainnet. Therefore, users need to pay high gas fees and wait for long time to finalize transactions.
  - To solve this issue from user perspective, I try to do that Geyser's smart contract works on Polygon.

&nbsp;

***

## 【Workflow】
- Diagram of workflow
![【Diagram】Geyser on Polygon](https://user-images.githubusercontent.com/19357502/119259362-e7d22000-bc08-11eb-8904-6ca1afe11d28.jpg)

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
npm install
```

<br>

### ② Compile contracts
- on Polygon (Matic) mumbai testnet
```
npm run compile:polygon_testnet
```

<br>

## 【Script for demo】on Polygon (Matic) mumbai testnet
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
(※ This script include deployment of smart contracts on Polygon)
```
npm run script:Geyser
```

<br>

## 【Demo】
- Demo video that script above is executed
https://youtu.be/nwyNV8b0XyI


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
