require('dotenv').config()
//const Tx = require('ethereumjs-tx').Transaction

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(`https://goerli.infura.io/v3/${ process.env.INFURA_KEY }`)
const web3 = new Web3(provider)

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const Geyser = artifacts.require("Geyser")
const GeyserFactory = artifacts.require("GeyserFactory")
const GeyserToken = artifacts.require("GeyserToken")
const LPToken = artifacts.require("LPToken")
const RewardToken = artifacts.require("RewardToken")

/// Deployed-contract addresses on Polygon testnet
let GEYSER_FACTORY = contractAddressList["Polygon Mumbai Testnet"]["Geyser"]["GeyserFactory"]
let GEYSER_TOKEN = tokenAddressList["Polygon Mumbai Testnet"]["Geyser"]["GeyserToken"]
let LP_TOKEN = tokenAddressList["Polygon Mumbai Testnet"]["Geyser"]["LPToken"]
let REWARD_TOKEN = tokenAddressList["Polygon Mumbai Testnet"]["Geyser"]["RewardToken"]

/// Variable to assign a Geyser contract address
let GEYSER

/// Global contract instance
let geyser
let geyserFactory
let geyserToken
let lpToken
let rewardToken

/// Acccounts
let deployer


/***
 * @dev - Execution COMMAND: $ npm run script:Geyser
 *        ($ truffle exec ./scripts/polygon-matic/Geyser.script.js --network polygon_testnet) 
 **/


///-----------------------------------------------
/// Execute all methods
///-----------------------------------------------

/// [Note]: For truffle exec (Remarks: Need to use module.exports)
module.exports = function(callback) {
    main().then(() => callback()).catch(err => callback(err));
};

async function main() {
    console.log("\n------------- Setup smart-contracts -------------")
    await setUpSmartContracts()

    console.log("\n------------- Check wallet addresses -------------")
    await checkStateInAdvance()

}


///-----------------------------------------------
/// Methods
///-----------------------------------------------
async function setUpSmartContracts() {
    console.log("Create the Reward Token (mock) contract instance")
    rewardToken = await RewardToken.at(REWARD_TOKEN)

    console.log("Create the UNI-V2 LP Token (mock) contract instance");
    lpToken = await LPToken.at(LP_TOKEN)

    console.log("Create the GeyserToken contract instance")
    geyserToken = await GeyserToken.at(GEYSER_TOKEN)

    console.log("Create the GeyserFactory contract instance")
    geyserFactory = await GeyserFactory.at(GEYSER_TOKEN)

    /// Logs (each deployed-contract addresses)
    console.log('=== REWARD_TOKEN ===', REWARD_TOKEN)
    console.log('=== LP_TOKEN ===', LP_TOKEN)    
    console.log('=== GEYSER_TOKEN ===', GEYSER_TOKEN)
    console.log('=== GEYSER_FACTORY ===', GEYSER_FACTORY)
}

async function checkStateInAdvance() {
    console.log("Wallet address should be assigned into deployer")
    deployer = process.env.DEPLOYER_ADDRESS

    /// [Log]
    console.log('=== deployer ===', deployer)
}


///--------------------------------------------
/// Get event
///--------------------------------------------
async function getEvents(contractInstance, eventName) {
    const _latestBlock = await getCurrentBlock()
    const LATEST_BLOCK = Number(String(_latestBlock))

    /// [Note]: Retrieve an event log of eventName (via web3.js v1.0.0)
    let events = await contractInstance.getPastEvents(eventName, {
        filter: {},
        fromBlock: LATEST_BLOCK,  /// [Note]: The latest block on Kovan testnet
        //fromBlock: 0,
        toBlock: 'latest'
    })
    console.log(`\n=== [Event log]: ${ eventName } ===`, events[0].returnValues)
    return events[0].returnValues
} 


///---------------------------------------------------------
/// Get current block number
///---------------------------------------------------------
async function getCurrentBlock() {
    const currentBlock = await web3.eth.getBlockNumber()
    return currentBlock
}
