const GeyserFactory = artifacts.require("GeyserFactory")
const GeyserToken = artifacts.require("GeyserToken")

const GEYSER_TOKEN = geyserToken.address

module.exports = async function(deployer) {
    await deployer.deploy(GEYSER_TOKEN, GeyserFactory)
}
