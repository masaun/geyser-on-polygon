const GeyserToken = artifacts.require("GeyserToken")

module.exports = async function(deployer) {
    await deployer.deploy(GeyserToken)
}
