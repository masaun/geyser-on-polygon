require('dotenv').config()
//const Tx = require('ethereumjs-tx').Transaction

/// Web3 instance
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider(`https://goerli.infura.io/v3/${ process.env.INFURA_KEY }`)
const web3 = new Web3(provider)

/// Geyser's helper
const { tokens, bonus, days, toFixedPointBigNumber, fromFixedPointBigNumber } = require('./geyser/util/helper')

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
    main().then(() => callback()).catch(err => callback(err))
};

async function main() {
    console.log("\n------------- Setup smart-contracts -------------")
    await setUpSmartContracts()

    console.log("\n------------- Check wallet addresses -------------")
    await checkStateInAdvance()

    console.log("\n------------- Workflow of GeyserFactory contract -------------")
    await createNewGeyser()
    await count()

    console.log("\n------------- Workflow of Geyser contract -------------")
    await fund()
    await stake()
    await lastUpdated()
    await totalStakingShares()
    //await totalStakingShareSeconds()
    await unstake()
}


///-----------------------------------------------
/// Methods
///-----------------------------------------------
async function setUpSmartContracts() {
    console.log("Create the Reward Token (mock) contract instance")
    rewardToken = await RewardToken.at(REWARD_TOKEN)

    console.log("Create the UNI-V2 LP Token (mock) contract instance")
    lpToken = await LPToken.at(LP_TOKEN)

    console.log("Create the GeyserToken contract instance")
    geyserToken = await GeyserToken.at(GEYSER_TOKEN)

    console.log("Create the GeyserFactory contract instance")
    geyserFactory = await GeyserFactory.at(GEYSER_FACTORY)

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

async function createNewGeyser() {
    console.log("\n create() - create a new Geyser");

    const stakingToken = LP_TOKEN
    const rewardToken = REWARD_TOKEN
    const bonusMin = bonus(0.0)
    const bonusMax = bonus(2.0)
    const bonusPeriod = days(90)
    //console.log("=== bonusMin ===", fromWei(bonusMin))
    //console.log("=== bonusMax ===", fromWei(bonusMax))
    //console.log("=== bonusPeriod ===", String(bonusPeriod))

    let txReceipt = await geyserFactory.create(stakingToken, 
                                               rewardToken, 
                                               bonusMin, 
                                               bonusMax, 
                                               bonusPeriod, 
                                               { from: deployer })

    /// Retrive emitted-event
    let event = await getEvents(geyserFactory, "GeyserCreated")

    /// Create the Geyser contract instance
    GEYSER = event.geyser
    geyser = await Geyser.at(GEYSER)
    console.log("=== GEYSER ===", GEYSER)
    //console.log('=== geyser ===', geyser)
}

async function count() {
    console.log("\n count() - total number of Geysers created by the factory");
    /// [Return]: total number of Geysers created by the factory
    let totalNumberOfGeysers = await geyserFactory.count()
    console.log("=== total number of Geysers created by the factory ===", String(totalNumberOfGeysers))
}

async function fund() {
    console.log("\n A owner funds 100 RewardTokens to the Geyser");

    let rewardTokenBalance = await rewardToken.balanceOf(deployer)
    console.log("=== rewardTokenBalance ===", fromWei(rewardTokenBalance))

    // owner funds geyser
    const rewardTokenAmount = toWei("1000")
    const duration = days(180)
    let txReceipt1 = await rewardToken.approve(GEYSER, rewardTokenAmount, { from: deployer })
    let txReceipt2 = await geyser.methods["fund(uint256,uint256)"](rewardTokenAmount, duration, { from: deployer })
}

async function stake() {
    console.log("\n stake() - stake 10 LP tokens");

    const lpAmount = toWei("10")
    const calldata = []

    /// [Note]: LP token is staking token
    /// deployer stakes 10 LP tokens
    let txReceipt1 = await lpToken.approve(GEYSER, lpAmount, { from: deployer })
    let txReceipt2 = await geyser.stake(lpAmount, calldata, { from: deployer })
    console.log('=== Tx hash of stake() ===', txReceipt2.tx)
    console.log('=== txReceipt of stake() ===', txReceipt2)

    /// Retrive emitted-event
    let event = await getEvents(geyser, "Staked")

    /// Update
    await geyser.update({ from: deployer })
}

async function lastUpdated() {
    console.log("\n lastUpdated()");
    
    let _lastUpdated = await geyser.lastUpdated()
    console.log('=== geyser.lastUpdated() ===', String(_lastUpdated))
}

async function totalStakingShares() {
    console.log("\n totalStakingShares()");
    
    let _totalStakingShares = await geyser.totalStakingShares()
    console.log('=== totalStakingShares ===', fromWei(_totalStakingShares))
}
 
// async function totalStakingShareSeconds() {
//     console.log("\n totalStakingShareSeconds()");
    
//     let _totalStakingShareSeconds = await geyser.totalStakingShareSeconds()
//     console.log('=== totalStakingShareSeconds ===', fromWei(totalStakingShareSeconds))
// }

async function unstake() {
    console.log("\n unstake() - unstake 10 LP tokens")
    
    const lpAmount = toWei("10")
    const gysrAmount = toWei("1")
    const calldata = []

    /// [Note]: There are 2 unstake() methods in the Geyser.sol. Therefore, how to use method below is used
    let txReceipt = await geyser.methods["unstake(uint256,bytes)"](lpAmount, calldata, { from: deployer })
    console.log('=== Tx hash of unstake() ===', txReceipt.tx)

    /// Retrive emitted-event
    let event1 = await getEvents(geyser, "RewardsUnlocked")
    let event2 = await getEvents(geyser, "Unstaked")
    let event3 = await getEvents(geyser, "RewardsDistributed")
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
    console.log(`\n=== [Event log emitted]: ${ eventName } ===`, events[0].returnValues)
    return events[0].returnValues
} 


///---------------------------------------------------------
/// Get current block number
///---------------------------------------------------------
async function getCurrentBlock() {
    const currentBlock = await web3.eth.getBlockNumber()
    return currentBlock
}

async function getCurrentTimestamp() {
    const currentBlock = await web3.eth.getBlockNumber()
    const currentTimestamp = await web3.eth.getBlock(currentBlock).timestamp

    return currentTimestamp
}


///---------------------------------------------------------
/// Methods for converting unit
///---------------------------------------------------------
function toWei(amount) {
    return web3.utils.toWei(`${ amount }`, 'ether')
} 

function fromWei(amount) {
    return web3.utils.fromWei(`${ amount }`, 'ether')
}
