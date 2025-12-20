// Deployment script for NFTReceipt contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying NFTReceipt contract...");

  const NFTReceipt = await hre.ethers.getContractFactory("NFTReceipt");
  const nftReceipt = await NFTReceipt.deploy();

  await nftReceipt.waitForDeployment();

  const address = await nftReceipt.getAddress();
  console.log(`NFTReceipt deployed to: ${address}`);

  // Verify contract
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await nftReceipt.deploymentTransaction().wait(6);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: []
      });
      console.log("Contract verified!");
    } catch (error) {
      console.log("Error verifying contract:", error.message);
    }
  }

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
