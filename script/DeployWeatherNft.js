const hre = require("hardhat")
const { ethers, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { getSecrets } = require("../utils/SecretsGenerator")
const { verifyContract } = require("../utils/verify")
const fs = require("fs")
require("dotenv").config()

async function main() {
    const chainId = network.config.chainId
    const secrets = { apiKey: process.env.WEATHER_API_KEY }

    const router = networkConfig[chainId].router
    const sourceCode = fs.readFileSync("./FunctionsSourceCode/GetWeather.js").toString()
    const encryptedSecrets = await getSecrets(secrets, hre)
    const subId = networkConfig[chainId].functionsSubId
    const gasLimit = networkConfig[chainId].functionsGasLimit
    const donId = networkConfig[chainId].donId

    const args = [router, sourceCode, encryptedSecrets, subId, gasLimit, donId]

    const weatherNftFactory = await ethers.getContractFactory("WeatherNft")

    console.log("Deploying Contract...");

    const contract = await weatherNftFactory.deploy(...args)

    console.log("Contract Deployed at address -", contract.address);

    console.log("Waiting for 3 block confirmations...");

    await contract.deployTransaction.wait(3)

    console.log("Done!");

    await verifyContract(contract.address, args)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })