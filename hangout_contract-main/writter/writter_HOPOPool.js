const hre = require("hardhat");
const ethers = hre.ethers;
const deployResult = require('../deploy/deploy_result');
const deployConfig = require("../deploy/deploy_config")[hre.network.name];

async function getContract() {
  return await ethers.getContractAt(deployResult.getData().deployedContract.hopoPool.contractName, deployResult.getData().deployedContract.hopoPool.address);
}

async function setSigner(signer) {
  const hopoPool = await getContract();
  await (await hopoPool.setSigner(signer)).wait();
  console.log("signer:", (await hopoPool.functions.signer())[0]);
}

async function transferOwnership(newOwner) {
  const hopoPool = await getContract();
  await (await hopoPool.transferOwnership(newOwner)).wait();
  console.log("owner:", await hopoPool.owner());
}

async function main() {
  const [sender] = await ethers.getSigners();
  console.log("network:", hre.network.name);
  console.log("sender:", sender.address);

  await deployResult.load();

  await setSigner(deployConfig.HOPOSigner);
  await transferOwnership(deployConfig.HOPOOwner);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
