const hre = require("hardhat");
const ethers = hre.ethers;
const deployResult = require('./deploy_result');
const deployConfig = require("./deploy_config")[hre.network.name];

// Factories
let HangoutXAdventureTeamBadgeV2Facory;

// contract object
let hangoutXAdventureTeamBadgeV2;

async function getContractFactories() {
  HangoutXAdventureTeamBadgeV2Facory = await ethers.getContractFactory("HangoutXAdventureTeamBadgeV2");
}

async function deployContract() {
  hangoutXAdventureTeamBadgeV2 = await HangoutXAdventureTeamBadgeV2Facory.deploy();
  await hangoutXAdventureTeamBadgeV2.deployed();
  deployResult.writeAbi("HangoutXAdventureTeamBadgeV2", HangoutXAdventureTeamBadgeV2Facory);
  deployResult.writeDeployedContract(
    "hangoutXAdventureTeamBadgeV2",
    hangoutXAdventureTeamBadgeV2.address,
    "HangoutXAdventureTeamBadgeV2"
  );

  deployResult.save();
}


async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("network:", hre.network.name);
  console.log("deployer:", deployer.address);

  //
  await deployResult.load();

  console.log("begin getContractFactories");
  await getContractFactories();

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
























