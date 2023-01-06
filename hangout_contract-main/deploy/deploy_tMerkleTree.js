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

async function deployContract() {
  const TMerkleTreeFactory = await ethers.getContractFactory('TMerkleTree');
  const tMerkleTree = await TMerkleTreeFactory.deploy();
  await tMerkleTree.deployed();
  deployResult.writeAbi('TMerkleTree', TMerkleTreeFactory);
  deployResult.writeDeployedContract(
    'tMerkleTree',
    tMerkleTree.address,
    'TMerkleTree'
  );

  deployResult.save();
}


async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("network:", hre.network.name);
  console.log("deployer:", deployer.address);

  //
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
























