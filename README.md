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
- Version for following the `Liquity` smart contract
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

### ② Compile & migrate contracts (on local)
```
$ npm run migrate:local
```

<br>

## 【Test】on Kovan (testnet-fork approach)
- 1: Get API-key from Infura  
https://infura.io/

<br>

- 2: Start ganache-cli with kovan testnet-fork (using Infura Key of Kovan tesntnet)
```
$ ganache-cli -d --fork https://kovan.infura.io/v3/{YOUR INFURA KEY OF KOVAN}
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

## 【Script】on Polygon (Matic)
- In case of deploying smart contract on `Matic's Mumbai testnet`
```
$ npm run migrate:polygon_testnet
```

<br>


***

## 【References】
- Polygon (Open Defi Hackathon)：https://gitcoin.co/issue/maticnetwork/matic-bounties/20/100025642
