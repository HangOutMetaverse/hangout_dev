// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// import {ethers} from "hardhat";
// import {ZERO_ADDRESS} from "../test/utils/helpers";

const hre = require("hardhat");
const ethers = hre.ethers;
const deployResult = require('./deploy_result');
const deployConfig = require("./deploy_config")[hre.network.name];

// Factories
let HangOutETHFlatlandFacory;

// contract object
let hangOutETHFlatLand;

async function getContractFactories() {
  HangOutETHFlatlandFacory = await ethers.getContractFactory("HangOutETHFlatland");
}

async function deployContract() {
  hangOutETHFlatLand = await HangOutETHFlatlandFacory.deploy(
    deployConfig.signer,
    deployConfig.fieldMerkleRoot,
    deployConfig.landsMerkleRoot
  );
  await hangOutETHFlatLand.deployed();

  deployResult.writeAbi("HangOutETHFlatland", HangOutETHFlatlandFacory);
  deployResult.writeDeployedContract(
    "hangOutETHFlatLand",
    hangOutETHFlatLand.address,
    "HangOutETHFlatland",
    {
      signer: deployConfig.signer,
      fieldMerkleRoot: deployConfig.fieldMerkleRoot,
      landsMerkleRoot: deployConfig.landsMerkleRoot
    }
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
























