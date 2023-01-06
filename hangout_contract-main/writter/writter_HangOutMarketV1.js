const hre = require("hardhat");
const ethers = hre.ethers;
const deployResult = require('../deploy/deploy_result');
const deployConfig = require("../deploy/deploy_config")[hre.network.name];


async function getContract() {
  return await ethers.getContractAt(
    deployResult.getData().deployedContract.hangOutMarketV1.contractName,
    deployResult.getData().deployedContract.hangOutMarketV1.address
  );
}

async function setSigner(signer) {
  const hangOutMarketV1 = await getContract();
  await (await hangOutMarketV1.setSigner(signer)).wait();
  console.log("signer:", (await hangOutMarketV1.functions.signer())[0]);
}

async function setInventoryQuantity(goodsId, quantity) {
  const hangOutMarketV1 = await getContract();
  await (await hangOutMarketV1.setInventoryQuantity(goodsId, quantity)).wait();
  console.log("inventory quantity:", await hangOutMarketV1.inventoryQuantity(goodsId));
}

async function setStart(start) {
  const hangOutMarketV1 = await getContract();
  await (await hangOutMarketV1.setStart(start)).wait();
  console.log("start:", await hangOutMarketV1.start());
}

async function transferOwnership(newOwner) {
  const hangOutMarketV1 = await getContract();
  await (await hangOutMarketV1.transferOwnership(newOwner)).wait();
  console.log("owner:", await hangOutMarketV1.owner());
}

async function main() {
  const [sender] = await ethers.getSigners();
  console.log("network:", hre.network.name);
  console.log("sender:", sender.address);

  await deployResult.load();

  // await setInventoryQuantity(0, 10000);
  // await setInventoryQuantity(1, 10000);
  // await setInventoryQuantity(2, 10000);
  // await setInventoryQuantity(3, 10000);
  // await setInventoryQuantity(4, 10000);
  
  await setSigner(deployConfig.MarketSigner);
  await setStart(true);
  await transferOwnership(deployConfig.MarketOwner);
}

main()
  .then(() => process.exit(0))
  .catch(e => {    console.error(e);
    process.exit(1);
  })
