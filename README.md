# Geyser on Polygon

***
## 【Introduction of the Geyser on Polygon】
- This is a smart contract that 

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

## 【Test】on Local
- 1: Start ganache-cli with kovan testnet-fork (using Infura Key of Kovan tesntnet)
```
$ ganache-cli -d
```
(※ `-d` option is the option in order to be able to use same address on Ganache-CLI every time)  
(※ Please stop and re-start if an error of `"Returned error: project ID does not have access to archive state"` is displayed)  

<br>

- 2: Execute test of the smart-contracts (on the local)
  - Test for the GeyserFactory contract  
    `$ npm run test:GeyserFactory`  
    ($ truffle test ./test/test-local/GeyserFactory.test.js) 

  - Test for the Geyser contract  
    `$ npm run test:Geyser`  
    ($ truffle test ./test/test-local/Geyser.test.js) 

<br>

***

## 【References】
- Polygon (Open Defi Hackathon)：https://gitcoin.co/issue/maticnetwork/matic-bounties/20/100025642
