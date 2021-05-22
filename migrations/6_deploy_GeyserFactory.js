const GeyserFactory = artifacts.require("GeyserFactory")
const GeyserToken = artifacts.require("GeyserToken")

const GEYSER_TOKEN = GeyserToken.address

module.exports = async function(deployer) {
    await deployer.deploy(GeyserFactory, GEYSER_TOKEN)
}
