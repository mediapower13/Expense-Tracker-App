// Deployment script for ExpenseTracker contract
const hre = require("hardhat");

async function main() {
  console.log("Deploying ExpenseTracker contract...");

  const ExpenseTracker = await hre.ethers.getContractFactory("ExpenseTracker");
  const expenseTracker = await ExpenseTracker.deploy();

  await expenseTracker.waitForDeployment();

  const address = await expenseTracker.getAddress();
  console.log(`ExpenseTracker deployed to: ${address}`);

  // Verify contract on Etherscan (if not local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await expenseTracker.deploymentTransaction().wait(6);
    
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
