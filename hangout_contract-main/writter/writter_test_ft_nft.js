const hre = require("hardhat");
const ethers = hre.ethers;
const deployResult = require('../deploy/deploy_result');
const deployConfig = require("../deploy/deploy_config")[hre.network.name];


async function getHangOutETHFlatland() {
  return await ethers.getContractAt(deployResult.getData().deployedContract.hangOutETHFlatLand.contractName, deployResult.getData().deployedContract.hangOutETHFlatLand.address);
}

async function openMint() {
  let hangOutETHFlatland = await getHangOutETHFlatland();
  await (await hangOutETHFlatland.flipMintState()).wait();
  console.log("openMint:", await hangOutETHFlatland.openMint());
}

async function mintFieldWhitelist(sender) {
  let hangOutETHFlatland = await getHangOutETHFlatland();
  let fieldId = 0;
  let signature = '0xff990810e72d5b71860dc09d7f1c96d9050ef3bdcacea2f0041aaf03c33ef60276857dcc63cf27ab3e3d5e51a459399854af808c6592ddbe7d7b7eaf3e4a1f851b';
  let merkleProof = [
    '0x0000000000000000000000007f886a635eb30c681e43db2185dc29a2b5d0a8b6',
    '0x38bc0ae819a9c99f46bc6ad2b36a31763c34d25008934532edc2bf8e1afc6b1e'
  ];
  let option = {value: ethers.utils.parseEther("0.00246")};
  await (await hangOutETHFlatland.mintFieldWhitelist(fieldId, signature, merkleProof, option)).wait();
  console.log("balance:", await hangOutETHFlatland.balanceOf(sender.address));
}

async function mintLandsWhitelist(sender) {
  let hangOutETHFlatland = await getHangOutETHFlatland();
  let landIds = [100,101];
  let signature = '0x30e1760e26a1ec7927f242779c6cbf6704fb8fb254e32bb25157dc89586860fe1cc1b08e4b59b1f02e9ecbd6145b7142603ce90262047d2d2259c74e1d3567fe1c';
  let merkleProof = [
    '0x0000000000000000000000007f886a635eb30c681e43db2185dc29a2b5d0a8b6',
    '0x38bc0ae819a9c99f46bc6ad2b36a31763c34d25008934532edc2bf8e1afc6b1e'
  ];
  let option = {value: ethers.utils.parseEther("0.00246")};
  await (await hangOutETHFlatland.mintLandsWhitelist(landIds, signature, merkleProof, option)).wait();
  console.log("balance:", await hangOutETHFlatland.balanceOf(sender.address));
}

async function mintScene(sender) {
  let hangOutETHFlatland = await getHangOutETHFlatland();
  let fieldId = 300;
  let signature = '0xb24ce713841be733d1b0b37b7aca3842c9adc894ed5fc061ecca0dec1383cbe04c6327e1469d296f057fe32589ac10507731d81ea53eda172dc5606ec60739ea1c';
  let option = {value: ethers.utils.parseEther("0.00246")};
  await (await hangOutETHFlatland.mintField(fieldId, signature, option)).wait();
  console.log("balance:", await hangOutETHFlatland.balanceOf(sender.address));
}

async function mintPlots(sender) {
  let hangOutETHFlatland = await getHangOutETHFlatland();
  let landIds = [3911];
  let signature = '0x097227af9b2585ca7a0761eb61ddfd5dddc1daf2e3513845afd816c25eb119a5390c89c1f226c294e68f175f1217a71da1750e5231a4f7e85df4037a4aabcc381c';
  let option = {value: ethers.utils.parseEther("0.26")};
  await (await hangOutETHFlatland.mintPlots(landIds, signature, option)).wait();
  console.log("balance:", await hangOutETHFlatland.balanceOf(sender.address));
}

async function setMerkleRoots(sceneMerkleRoot, plotsMerkleRoot) {
  const hangOutETHFlatland = await getHangOutETHFlatland();
  await (await hangOutETHFlatland.setMerkleRoots(sceneMerkleRoot, plotsMerkleRoot)).wait();
  console.log("scene merkle root:", await hangOutETHFlatland.sceneMerkleRoot());
  console.log("plots merkle root:", await hangOutETHFlatland.plotsMerkleRoot());
}

async function setBaseURI(URI) {
  const baseURI = `ipfs://${URI}/`;
  const hangOutETHFlatland = await getHangOutETHFlatland();
  await (await hangOutETHFlatland.setBaseURI(baseURI)).wait();
  console.log("baseURI:", await hangOutETHFlatland.baseURI());
}

async function setPrices(largePrice, mediumPrice, smallPrice) {
  const hangOutETHFlatland = await getHangOutETHFlatland();
  await (await hangOutETHFlatland.setPrices(largePrice, mediumPrice, smallPrice)).wait();
  console.log("price:", await hangOutETHFlatland.getPrices());
}

async function setMaxLimit(sceneWhitelistMaxPlots, plotsWhitelistMaxPlots, txMaxPlots) {
  const hangOutETHFlatland = await getHangOutETHFlatland();
  await (await hangOutETHFlatland.setMaxLimit(sceneWhitelistMaxPlots, plotsWhitelistMaxPlots, txMaxPlots)).wait();
  console.log("maxSceneOneAddr:", await hangOutETHFlatland.maxSceneOneAddr());
  console.log("maxPlotOneAddr:", await hangOutETHFlatland.maxPlotOneAddr());
  console.log("txMaxPlots:", await hangOutETHFlatland.txMaxPlots());
}

async function withdraw(receivor) {
  const hangOutETHFlatland = await getHangOutETHFlatland();
  const balance = await ethers.provider.getBalance(hangOutETHFlatland.address);
  console.log("before balance:", balance);
  await (await hangOutETHFlatland.withdraw(receivor, balance)).wait();
  console.log("after balance:", balance);
}

async function transferOwnership(newOwner) {
  let hangOutETHFlatland = await getHangOutETHFlatland();
  await (await hangOutETHFlatland.transferOwnership(newOwner)).wait();
  console.log("new owner:", await hangOutETHFlatland.owner());
}

async function main() {
  const [sender] = await ethers.getSigners();
  console.log("network:", hre.network.name);
  console.log("sender:", sender.address);

  await deployResult.load();

  // await openMint();
  // await mintFieldWhitelist(sender);
  // await mintLandsWhitelist(sender);
  // await mintScene(sender);
  // await mintPlots(sender);
  // await setMerkleRoots(
  //   '0x000000000000000000000000fa567946c76d7fed013bd8c66786775b44001f49',
  //   '0x000000000000000000000000fa567946c76d7fed013bd8c66786775b44001f49'
  // );
  // await setBaseURI('QmTPq1ttRizN9pAWx8NfY6pQeBfz4khVY5U1srkM7p1Veb');
  // await setPrices(
  //   ethers.utils.parseEther("0.25"),
  //   ethers.utils.parseEther("0.13"),
  //   ethers.utils.parseEther("0.09")
  // );
  await setMaxLimit(1, 100, 16);

  // await withdraw(sender.address);

  // await transferOwnership('0x145FF683e85F289FAB329835926a16a8f57762C8');

}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
