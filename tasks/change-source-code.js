const fs = require("fs")

task("change-source-code", "Changes the JavaScript Source Code in the required contract for chainlink functions request.")
.addParam("name", "Contract Name")
.addParam("contract", "Address for the contract")
.addParam("source", "New source code file path")
.setAction(async (taskArgs, hre) => {
    const contract = await hre.ethers.getContractAt(taskArgs.name, taskArgs.contract)
    const sourceCode = fs.readFileSync(taskArgs.source).toString()
    console.log("Changing the source code...")

    const response = await contract.setSourceCode(sourceCode)
    await response.wait(1)

    console.log("Source Code changed successfully!")
})

module.exports = { }