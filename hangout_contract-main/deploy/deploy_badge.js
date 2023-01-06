const hre = require("hardhat");
const ethers = hre.ethers;
const deployResult = require('./deploy_result');
const deployConfig = require("./deploy_config")[hre.network.name];

// Factories
let HangoutXAdventureTeamBadgeFacory;

// contract object
let hangoutXAdventureTeamBadge;

async function getContractFactories() {
  HangoutXAdventureTeamBadgeFacory = await ethers.getContractFactory("HangoutXAdventureTeamBadge");
}

async function deployContract() {
  hangoutXAdventureTeamBadge = await HangoutXAdventureTeamBadgeFacory.deploy();
  await hangoutXAdventureTeamBadge.deployed();
  deployResult.writeAbi("HangoutXAdventureTeamBadge", HangoutXAdventureTeamBadgeFacory);
  deployResult.writeDeployedContract(
    "hangoutXAdventureTeamBadge",
    hangoutXAdventureTeamBadge.address,
    "HangoutXAdventureTeamBadge"
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
























