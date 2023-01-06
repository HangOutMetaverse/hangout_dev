const hre = require("hardhat");
const ethers = hre.ethers;
const deployResult = require('../deploy/deploy_result');
const deployConfig = require("../deploy/deploy_config")[hre.network.name];

async function getContract() {
  return await ethers.getContractAt(deployResult.getData().deployedContract.hangOutPoint.contractName, deployResult.getData().deployedContract.hangOutPoint.address);
}

async function transferOwnership(newOwner) {
  const hangOutPoint = await getContract();
  await (await hangOutPoint.transferOwnership(newOwner)).wait();
  console.log("owner:", await hangOutPoint.owner());
}

async function main() {
  const [sender] = await ethers.getSigners();
  console.log("network:", hre.network.name);
  console.log("sender:", sender.address);

  await deployResult.load();
  await transferOwnership(deployConfig.HOPOOwner);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
