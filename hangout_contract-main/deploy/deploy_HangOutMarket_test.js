// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// import {ethers} from "hardhat";
// import {ZERO_ADDRESS} from "../test/utils/helpers";

const hre = require("hardhat");
const ethers = hre.ethers;
const deployResult = require("./deploy_result");
const deployConfig = require("./deploy_config")[hre.network.name];

let usdt;
let usdc;
let erc20;
let erc721;
let erc1155;
let hangoutMarket;
let virtualGoodsShelf;
let erc20GoodsShelf;
let erc721GoodsShelf;
let erc1155GoodsShelf;

async function deployMocContract() {
  // usdt
  const ERC20Test = await ethers.getContractFactory("ERC20Test");
  deployResult.writeAbi("ERC20Test", ERC20Test);
  usdt = await ERC20Test.deploy("USDT", "USDT");
  await usdt.deployed();
  deployResult.writeDeployedContract(
    "usdt",
    usdt.address,
    "ERC20Test",
    {
      name: "usdt",
      symbol: "usdt",
    });

  deployResult.save();

  // usdc
  usdc = await ERC20Test.deploy("USDC", "USDC");
  await usdc.deployed();
  deployResult.writeDeployedContract(
    "usdc",
    usdc.address,
    "ERC20Test",
    {
      name: "usdc",
      symbol: "usdc",
    });

  deployResult.save();

  // erc20
  erc20 = await ERC20Test.deploy("ERC20 name", "ERC20Symbol");
  await erc20.deployed();
  deployResult.writeDeployedContract(
    "erc20",
    erc20.address,
    "ERC20Test",
    {
      name: "ERC20 name",
      symbol: "ERC20Symbol",
    });

  deployResult.save();

  // erc721
  const ERC721Test = await ethers.getContractFactory("ERC721Test");
  deployResult.writeAbi("ERC721Test", ERC721Test);
  erc721 = await ERC721Test.deploy("ERC721Test name", "ERC721TestSymbol");
  await erc721.deployed();
  deployResult.writeDeployedContract(
    "erc721",
    erc721.address,
    "ERC721Test",
    {
      name: "ERC721Test name",
      symbol: "ERC721TestSymbol",
    });

  deployResult.save();

  // erc1155
  const ERC1155Test = await ethers.getContractFactory("ERC1155Test");
  deployResult.writeAbi("ERC1155Test", ERC1155Test);
  const uri = "http://tet.uri.com";
  erc1155 = await ERC1155Test.deploy(uri);
  await erc1155.deployed();
  deployResult.writeDeployedContract(
    "erc721",
    erc721.address,
    "ERC1155Test",
    {
      uri: uri,
    });

  deployResult.save();
}

async function deployHangoutMarket() {
  // HangOutMarket
  const HangOutMarket = await ethers.getContractFactory("HangOutMarket");
  deployResult.writeAbi("HangOutMarket", HangOutMarket);
  hangoutMarket = await HangOutMarket.deploy();
  hangoutMarket.deployed();

  deployResult.writeDeployedContract(
    "hangoutMarket",
    hangoutMarket.address,
    "HangOutMarket"
  );

  deployResult.save();
}

async function deployGoodsShelves() {
  // VirtualGoodsShelf
  const VirtualGoodsShelf = await ethers.getContractFactory("VirtualGoodsShelf");
  deployResult.writeAbi("VirtualGoodsShelf", VirtualGoodsShelf);
  virtualGoodsShelf = await VirtualGoodsShelf.deploy("virtualGoodsShelf name", hangoutMarket.address);
  await virtualGoodsShelf.deployed();
  deployResult.writeDeployedContract(
    "virtualGoodsShelf",
    virtualGoodsShelf.address,
    "VirtualGoodsShelf",
    {
      name: "virtualGoodsShelf name",
      caller: hangoutMarket.address,
    }
  );

  deployResult.save();


  // ERC20GoodsShelf
  const ERC20GoodsShelf = await ethers.getContractFactory("ERC20GoodsShelf");
  deployResult.writeAbi("ERC20GoodsShelf", ERC20GoodsShelf);
  erc20GoodsShelf = await ERC20GoodsShelf.deploy("ERC20GoodsShelf name", erc20.address, hangoutMarket.address);
  await erc20GoodsShelf.deployed();
  deployResult.writeDeployedContract(
    "erc20GoodsShelf",
    erc20GoodsShelf.address,
    "ERC20GoodsShelf",
    {
      name: "ERC20GoodsShelf name",
      goods: erc20.address,
      caller: hangoutMarket.address,
    }
  );

  deployResult.save();

  // ERC721GoodsShelf
  const ERC721GoodsShelf = await ethers.getContractFactory("ERC721GoodsShelf");
  deployResult.writeAbi("ERC721GoodsShelf", ERC721GoodsShelf);
  erc721GoodsShelf = await ERC721GoodsShelf.deploy("ERC721GoodsShelf name", erc721.address, hangoutMarket.address);
  await erc721GoodsShelf.deployed();
  deployResult.writeDeployedContract(
    "erc721GoodsShelf",
    erc721GoodsShelf.address,
    "ERC721GoodsShelf",
    {
      name: "ERC721GoodsShelf name",
      goods: erc721.address,
      caller: hangoutMarket.address,
    }
  );

  deployResult.save();

  // ERC1155GoodsShelf
  const ERC1155GoodsShelf = await ethers.getContractFactory("ERC1155GoodsShelf");
  deployResult.writeAbi("ERC1155GoodsShelf", ERC1155GoodsShelf);
  erc1155GoodsShelf = await ERC1155GoodsShelf.deploy("ERC1155GoodsShelf name", erc1155.address, hangoutMarket.address);
  await erc1155GoodsShelf.deployed();
  deployResult.writeDeployedContract(
    "erc1155GoodsShelf",
    erc1155GoodsShelf.address,
    "ERC1155GoodsShelf",
    {
      name: "ERC1155GoodsShelf name",
      goods: erc1155.address,
      caller: hangoutMarket.address,
    }
  );

  deployResult.save();
}

async function configGoodsShelves() {
  const moneys2 = [usdt.address, usdc.address];
  const prices2 = [ethers.utils.parseEther("1"), ethers.utils.parseEther("2")];

  await (await hangoutMarket.setValidMoney(usdt.address, true)).wait();
  await (await hangoutMarket.setValidMoney(usdc.address, true)).wait();
  console.log(`getMoneyInfos: ${await hangoutMarket.getMoneyInfos()}`);

  await (await hangoutMarket.setStart(true)).wait();
  console.log(`start: ${await hangoutMarket.start()}`);
  await (await hangoutMarket.putOnGoods(virtualGoodsShelf.address, moneys2, prices2)).wait();
  await (await hangoutMarket.putOnGoods(erc20GoodsShelf.address, moneys2, prices2)).wait();
  await (await hangoutMarket.putOnGoods(erc721GoodsShelf.address, moneys2, prices2)).wait();
  await (await hangoutMarket.putOnGoods(erc1155GoodsShelf.address, moneys2, prices2)).wait();
  console.log(`getGoodsShelvesInfos: ${await hangoutMarket.getGoodsShelvesInfos()}`);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("network:", hre.network.name);
  console.log("deployer:", deployer.address);

  console.log("begin load deployResult");
  await deployResult.load();

  console.log("begin deployMocContract");
  await deployMocContract();

  console.log("begin deployHangoutMarket");
  await deployHangoutMarket();

  console.log("begin deployContract");
  await deployGoodsShelves();

  console.log("begin configGoodsShelves");
  await configGoodsShelves();

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
























