// Deployment script for TokenPayment contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying TokenPayment contract...");

  const TokenPayment = await hre.ethers.getContractFactory("TokenPayment");
  const tokenPayment = await TokenPayment.deploy();

  await tokenPayment.waitForDeployment();

  const address = await tokenPayment.getAddress();
  console.log(`TokenPayment deployed to: ${address}`);

  // Verify contract
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await tokenPayment.deploymentTransaction().wait(6);
    
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
