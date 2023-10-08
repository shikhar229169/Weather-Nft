const { getSecrets } = require("../utils/SecretsGenerator")
require("dotenv").config()

task("change-secrets", "Changes the Secrets for the functions request")
.addParam("name", "Contract name in which you want to set secrets")
.addParam("contract", "Address of the contract")
.setAction(async(taskArgs, hre) => {
    const contract = await hre.ethers.getContractAt(taskArgs.name, taskArgs.contract)
    
    const secretsObj = {
        apiKey: process.env.WEATHER_API_KEY
    }
    
    const encryptedSecretsUrl = await getSecrets(secretsObj, hre)
    
    console.log("Setting Secrets in the contract - ", taskArgs.contract)
    
    const response = await contract.setSecrets(encryptedSecretsUrl)
    
    console.log("Waiting for 1 block confirmations.")
    
    await response.wait(1)
    
    console.log("Secrets Changed.")
})