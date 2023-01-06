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


async function deployContract() {

  // const TFTFactory = await ethers.getContractFactory('TFT');
  // const tft = await TFTFactory.deploy('Test FT', 'TFT');
  // await tft.deployed();
  // deployResult.writeAbi('TFT', TFTFactory);
  // deployResult.writeDeployedContract(
  //   'tft',
  //   tft.address,
  //   'TFT',
  //   {
  //     name: 'Test FT',
  //     symbol: 'TFT'
  //   }
  // );
  // deployResult.save();
  //
  // const StakingTestFactory = await ethers.getContractFactory('StakingTest');
  // const stakingTest = await StakingTestFactory.deploy(tft.address);
  // await stakingTest.deployed();
  // deployResult.writeAbi('StakingTest', StakingTestFactory);
  // deployResult.writeDeployedContract(
  //   'stakingTest',
  //   stakingTest.address,
  //   'StakingTest',
  //   {
  //     asset: tft.address
  //   }
  // );
  // deployResult.save();

  const TNFTFactory = await ethers.getContractFactory('TNFT');
  const tnft = await TNFTFactory.deploy('Test NFT', 'tnft');
  await tnft.deployed();
  deployResult.writeAbi('TNFT', TNFTFactory);
  deployResult.writeDeployedContract(
    'tnft',
    tnft.address,
    'TNFT',
    {
      name: 'Test NFT',
      symbol: 'TNFT'
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
























