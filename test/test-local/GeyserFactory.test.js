/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers');

/// Geyser's helper
const { tokens, bonus, days, toFixedPointBigNumber, fromFixedPointBigNumber } = require('./geyser/util/helper');

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const GeyserFactory = artifacts.require("GeyserFactory")
const GeyserToken = artifacts.require("GeyserToken")
const LPToken = artifacts.require("LPToken")
const RewardToken = artifacts.require("RewardToken")


/**
 * @notice - This is the test of GeyserFactory.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/GeyserFactory.test.js
 * @notice - [Using kovan-fork with Ganache-CLI and Infura]: Please reference from README
 */
contract("GeyserFactory", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let user3 = accounts[3]

    /// Global contract instance
    let geyserFactory
    let geyserToken
    let lpToken
    let rewardToken

    /// Global variable for each contract addresses
    let GEYSER_FACTORY
    let GEYSER_TOKEN
    let LP_TOKEN
    let REWARD_TOKEN

    async function getEvents(contractInstance, eventName) {
        const _latestBlock = await time.latestBlock()
        const LATEST_BLOCK = Number(String(_latestBlock))

        /// [Note]: Retrieve an event log of eventName (via web3.js v1.0.0)
        let events = await contractInstance.getPastEvents(eventName, {
            filter: {},
            fromBlock: LATEST_BLOCK, /// [Note]: The latest block on Kovan testnet
            //fromBlock: 0,
            toBlock: 'latest'
        })
        //console.log(`\n=== [Event log]: ${ eventName } ===`, events[0].returnValues)
        return events[0].returnValues
    } 

    describe("Setup smart-contracts", () => {
        it("Deploy the Reward Token (mock) contract instance", async () => {
            rewardToken = await RewardToken.new({ from: deployer })
            REWARD_TOKEN = rewardToken.address
        })

        it("Deploy the UNI-V2 LP Token (mock) contract instance", async () => {
            lpToken = await LPToken.new({ from: deployer })
            LP_TOKEN = lpToken.address
        })

        it("Deploy the GeyserToken contract instance", async () => {
            geyserToken = await GeyserToken.new({ from: deployer })
            GEYSER_TOKEN = geyserToken.address
        })

        it("Deploy the GeyserFactory contract instance", async () => {
            geyserFactory = await GeyserFactory.new(GEYSER_TOKEN, { from: deployer })
            GEYSER_FACTORY = geyserFactory.address
        })

        it("[Log]: Deployed-contracts addresses", async () => {
            console.log("=== REWARD_TOKEN ===", REWARD_TOKEN)
            console.log("=== LP_TOKEN ===", LP_TOKEN)
            console.log("=== GEYSER_TOKEN ===", GEYSER_TOKEN)
            console.log("=== GEYSER_FACTORY ===", GEYSER_FACTORY)
        })
    })

    describe("Workflow", () => {
        it("create()", async () => {
            const stakingToken = LP_TOKEN
            const rewardToken = REWARD_TOKEN
            const bonusMin = bonus(0.0)
            const bonusMax = bonus(1.0)
            const bonusPeriod = days(365)
            let txReceipt = await geyserFactory.create(stakingToken, 
                                                       rewardToken, 
                                                       bonusMin, 
                                                       bonusMax, 
                                                       bonusPeriod, 
                                                       { from: deployer })

            /// Retrive emitted-event
            let event = await getEvents(geyserFactory, "GeyserCreated")
            console.log("=== emitted-event: GeyserCreated ===", event)            
        })

        it("count()", async () => {
            /// [Return]: total number of Geysers created by the factory
            let totalNumberOfGeysers = await geyserFactory.count()
            console.log("=== total number of Geysers created by the factory ===", String(totalNumberOfGeysers))
        })
    })

})
