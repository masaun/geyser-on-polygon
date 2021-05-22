const Fancet = artifacts.require("Fancet")
const LPToken = artifacts.require("LPToken")
const RewardToken = artifacts.require("RewardToken")
const GeyserToken = artifacts.require("GeyserToken")

const LP_TOKEN = LPToken.address
const REWARD_TOKEN = RewardToken.address
const GEYSER_TOKEN = GeyserToken.address

module.exports = async function(deployer) {
    await deployer.deploy(Fancet, LP_TOKEN, REWARD_TOKEN, GEYSER_TOKEN)
}
