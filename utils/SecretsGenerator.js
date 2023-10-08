const { networkConfig } = require("../helper-hardhat-config")
const { SecretsManager, createGist } = require("@chainlink/functions-toolkit");
require("dotenv").config()

async function getSecrets(secrets) {
    const chainId = hre.network.config.chainId
    
    const provider = new hre.ethers.providers.JsonRpcProvider(network.config.url);

    const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY);
    const signer = wallet.connect(provider);
    
    const secretsManager = new SecretsManager({
        signer: signer,
        functionsRouterAddress: networkConfig[chainId].router,
        donId: networkConfig[chainId].donId,
    });

    await secretsManager.initialize();

    // Encrypt secrets
    const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);
    

    console.log(`Creating gist...`);
    const githubApiToken = process.env.GITHUB_API_TOKEN;
    if (!githubApiToken)
        throw new Error(
            "githubApiToken not provided - check your environment variables"
        );

    // Create a new GitHub Gist to store the encrypted secrets
    const gistURL = await createGist(
        githubApiToken,
        JSON.stringify(encryptedSecretsObj)
    );
    console.log(`\n✅Gist created ${gistURL} . Encrypt the URLs..`);
    const encryptedSecretsUrls = await secretsManager.encryptSecretsUrls([
        gistURL,
    ]);
    
    return encryptedSecretsUrls
}

module.exports = { getSecrets }