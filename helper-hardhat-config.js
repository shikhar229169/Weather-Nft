const networkConfig = {
    11155111: {
        name: "sepolia",
        router: "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0",
        donId: "fun-ethereum-sepolia-1",
        functionsSubId: "777",
        functionsGasLimit: "300000"
    },

    80001: {
        router: "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C",
        donId: "fun-polygon-mumbai-1",
        functionsSubId: "378",
        functionsGasLimit: "300000"
    },

    31337: {
        name: "hardhat",  
    }
}


const localNetworks = ["localhost", "hardhat"];

module.exports = { networkConfig, localNetworks };