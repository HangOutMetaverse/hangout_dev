const hre = require("hardhat");
const ethers = hre.ethers;
const deployResult = require("./deploy_result");

async function deployContract() {
  console.log(`hangOutPoint: ${deployResult.getData().deployedContract.hangOutPoint.address}`);
  const HOPOPool = await ethers.getContractFactory("HOPOPool");
  const hopoPool = await HOPOPool.deploy(deployResult.getData().deployedContract.hangOutPoint.address);
  await hopoPool.deployed();
  deployResult.writeAbi("HOPOPool", HOPOPool);
  deployResult.writeDeployedContract(
    "hopoPool",
    hopoPool.address,
    "HOPOPool",
    {
      HOPO: deployResult.getData().deployedContract.hangOutPoint.address
    }
  );

  deployResult.save();
}


async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("network:", hre.network.name);
  console.log("deployer:", deployer.address);

  console.log("begin load deploy result");
  await deployResult.load();

  console.log("begin deployContract");
  await deployContract(deployer);

  console.log("deploy done.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
























