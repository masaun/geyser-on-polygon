/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers')

/// Geyser's helper
const { tokens, bonus, days, toFixedPointBigNumber, fromFixedPointBigNumber } = require('./geyser/util/helper');

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const Geyser = artifacts.require("Geyser")
const GeyserFactory = artifacts.require("GeyserFactory")
const GeyserToken = artifacts.require("GeyserToken")
const LPToken = artifacts.require("LPToken")
const RewardToken = artifacts.require("RewardToken")


/**
 * @notice - This is the test of Geyser.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/Geyser.test.js
 * @notice - [Using kovan-fork with Ganache-CLI and Infura]: Please reference from README
 */
contract("Geyser", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let user3 = accounts[3]

    /// Global contract instance
    let geyser
    let geyserFactory
    let geyserToken
    let lpToken
    let rewardToken

    /// Global variable for each contract addresses
    let GEYSER
    let GEYSER_FACTORY
    let GEYSER_TOKEN
    let LP_TOKEN
    let REWARD_TOKEN

    function toWei(amount) {
        return web3.utils.toWei(`${ amount }`, 'ether')
    } 

    function fromWei(amount) {
        return web3.utils.fromWei(`${ amount }`, 'ether')
    }

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

        describe("Workflow of GeyserFactory.sol", () => {
            it("create() - create a new Geyser", async () => {
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

                /// Create the Geyser contract instance
                GEYSER = event.geyser
                geyser = await Geyser.at(GEYSER)
                console.log("=== GEYSER ===", GEYSER)
                //console.log('=== geyser ===', geyser)
            })

            it("count()", async () => {
                /// [Return]: total number of Geysers created by the factory
                let totalNumberOfGeysers = await geyserFactory.count()
                console.log("=== total number of Geysers created by the factory ===", String(totalNumberOfGeysers))
            })
        })

        describe("Workflow of Geyser.sol", () => {
            it("A owner funds 100 RewardTokens to the Geyser", async () => {
                let rewardTokenBalance = await rewardToken.balanceOf(deployer)
                console.log("=== rewardTokenBalance ===", fromWei(rewardTokenBalance))

                // owner funds geyser
                const rewardTokenAmount = toWei("1000")
                const duration = days(180)
                let txReceipt1 = await rewardToken.approve(GEYSER, rewardTokenAmount, { from: deployer })
                let txReceipt2 = await geyser.methods["fund(uint256,uint256)"](rewardTokenAmount, duration, { from: deployer })
            })

            it("stake() - stake 10 LP tokens", async () => {
                const lpAmount = toWei("10")
                const calldata = []

                /// [Note]: LP token is staking token
                let txReceipt1 = await lpToken.approve(GEYSER, lpAmount, { from: deployer })
                let txReceipt2 = await geyser.stake(lpAmount, calldata, { from: deployer })
            })

            it("Check the last updated-timestamp", async () => {
                let _lastUpdated = await geyser.lastUpdated()
                console.log('=== geyser.lastUpdated() ===', String(_lastUpdated))
            })

            it("time increase 30 days", async () => {
                let timestampBeforeTimeIncrease = await time.latest()
                console.log('=== Timestamp (Before time.increase) ===', String(timestampBeforeTimeIncrease))

                /// Advance time 30 days
                await time.increase(days(30))             /// Original
                //await time.increase(60 * 60 * 24 * 30)  /// 30 days

                /// Check timestamp (Before -> After)
                timestampAfterTimeIncrease = await time.latest()
                console.log('=== Timestamp (After time.increase) ===', String(timestampAfterTimeIncrease))
                console.log('=== days(30) ===', String(days(30)))

                await geyser.update({ from: deployer })
            })

            it("unstake() - unstake 10 LP tokens", async () => {
                const lpAmount = toWei("10")
                const calldata = []

                /// [Note]: There are 2 unstake() methods in the Geyser.sol. Therefore, how to use method below is used
                let txReceipt = await geyser.methods["unstake(uint256,bytes)"](lpAmount, calldata, { from: deployer })
            })
        })

    })

})

