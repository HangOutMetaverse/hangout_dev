import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, ContractFactory, Signer, utils } from "ethers";
const hrt = require("hardhat");

import {HangOutLand} from "../typechain/HangOutLand";
import { it } from "mocha";
import { createEvalAwarePartialHost } from "ts-node/dist/repl";
import { waffleChai } from "@nomiclabs/hardhat-waffle/dist/src/waffle-chai";

const MerkleRoot = "0x8290649546c9677bc983aedb38eb324d997a6be9a17a8e0a9bda52a87ae39f97";
const MerkleRoot2 = "0x267874771e0604c1bfa2d5b6980ee4b82f3e246f314fc4095c9470e4cf50f14c";

const WhitelistMint0Field0Sign = "0x33a8cccd008550fc1edd0e5c02e0f3082615a5131dd2cecc85ab081c20916943387d9b58fe4e72607ded39f52813d11e3a7824e2ba13cff975004096183a4cc81b";
const WhitelistMint0Field1Sign = "0x2af69c8495ea62d2b7dcd2fab4fcb66be3e38066dff414af8c56248190d773c6015b088fbf2f8b4ba0c1e25cd8886b4c12b8157d9cb99f22cc053ea6c1334a111b";
const WhitelistMintField0InvalidSign = "0x43a8cccd008550fc1edd0e5c02e0f3082615a5131dd2cecc85ab081c20916943387d9b58fe4e72607ded39f52813d11e3a7824e2ba13cff975004096183a4cc81b";

const Whitelist0Proof = [
  '0x00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8',
  '0x2cf0dbd9ac78a342813bd3c9aa40cb98bfeabe426236fcd7575dda06e61310c7',
  '0x00000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a65'
];

const Whitelist1Proof = [
  '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  '0x2cf0dbd9ac78a342813bd3c9aa40cb98bfeabe426236fcd7575dda06e61310c7',
  '0x00000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a65'
];

const Whitelist0InvalidProof = [
  '0x10000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8',
  '0x2cf0dbd9ac78a342813bd3c9aa40cb98bfeabe426236fcd7575dda06e61310c7',
  '0x00000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a65'
];


const WhitelistMint1Field0Sign = "0x553ee4dbe6d6fd3eb9f49097b91717036815a2f17967b165a1ff7bcd951445597200c665ef6c4b67293931ad012fdab253f7223c066dea32230222b570b6eb351b";

const Whitelist1InvalidProof = [
    '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    '0x2cf0dbd9ac78a342813bd3c9aa40cb98bfeabe426236fcd7575dda06e61310c7',
    '0x00000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a65'
];

const landIds100101102 = [100, 101, 102];
const WhitelistMint0Lands100101102Sign = "0x5689e3ec2751cc8ef94f57e3788a60d6980eed11aa1d4650b65e875074550a795e3397695b5578c80f6c0bc402348eb9c1894dbc2efbacb63d2dc8adecd44b3c1b";
const WhitelistMint0Lands100101InvalidSign = "0x8613c2c6019f39e89c2aaa7fe1955155a59679098396ac6fcd4d588ae7bd435a4eb80495ad94ba18222900d6ffd755b5e554a78202b85c22760dd300d7172f2e1b";
const WhitelistMint1Lands100101102Sign = "0xc5a78d60d42a2ed65f0f3f9864a5bb6d20c50d63620a6282cb9f351d2877255f6d12582298fce6dfc2d886de8f811387badb70f3c9e3f94334db2716ac8ef0021b";

const landIds103104105 = [103, 104, 105];
const WhitelistMint0Lands103104105Sign = "0xdde4e7570bff648fe5ec3f3f9dcd94f9ac6b38b0e1a8823288aaff2edb28e1542a1457a20de2fbb0eff98f37c64d185f148e1f43be3711a9bc53cf00a628204e1b";

const landIds106107108109 = [106, 107, 108, 109];
const WhitelistMint0Lands106107108109Sign = "0xda9efebdf169dff6d0cd171f568562d596826b82b44d2c0319cfff79cf22a7ea5b258eeb520c32b642abb9296416585f62e25fd7e7034cc7471569bbbf63507d1b";

const landIds87696 = [87696];
const WhitelistMint0Lands87696Sign = "0x33d2ff0e5cdecfa7d4e5ed805e5b920a3dc56beea5d0f132fd64042a93f2ecdb229f324e5ea227b1cf5f6cc36130f29cbdc414a2ba29d00a5b2080c45ef030921c";

const FieldPrice = ethers.utils.parseEther("0.001").mul(2).add(ethers.utils.parseEther("0.0001").mul(4)).add(ethers.utils.parseEther("0.00001").mul(6));
const LandsPrice2Medium = ethers.utils.parseEther("0.0001").mul(4);

const InvalidField = 28 * 29 * 9;
const WhitelistMint0Field7308Sign = "0xde612bc37bad32da74a07eceab667de589a9fa4bfde3a66937fd19bf081e282726ed230cd8bc91b6eb55552c0eb494d91dd90bdf0f95f3da68e9792a1942f8a21c";


const Mint0Field0Sign = "0x797733ca27730759b892a926596acc834dd6caf73ce0a63f809cb833fc4db10c764117b3f4a38ceaf1b08e6ef865a7029495a66692e1ed023e2765870b9af5c91c";
const Mint0Field0InvalidSign = "0x897733ca27730759b892a926596acc834dd6caf73ce0a63f809cb833fc4db10c764117b3f4a38ceaf1b08e6ef865a7029495a66692e1ed023e2765870b9af5c91c";
const Mint0Field7308Sign = "0x3fc1e1527446952cf9f85dbec7fe8ebb52f36b899695ee78839ded551541bd0d3519a63ef23acdb6e621099988192df987eca36e0fcfe28e2156f48fd6222d9c1b";

const Mint1Field0Sign = "0xcb37874961486750623862d858f146914d7e223638a0374371e52d166ad7679b204f0113278368f7b4c7aaf15b6e35c538a41e59b753ff63e1baa7152d8058661c";
const Mint0Lands100101102Sign = "0xc28fc9e49b7930f198a3dd0cde0189d88f20d3b4d67b2d1f21824942e3d1acc56d1509379482b190d5235ee3924e6fbf52fe265e23f342dde20edfbcc8b30e021c";
const Mint0Lands100101102InvalidSign = "0xd28fc9e49b7930f198a3dd0cde0189d88f20d3b4d67b2d1f21824942e3d1acc56d1509379482b190d5235ee3924e6fbf52fe265e23f342dde20edfbcc8b30e021c";

const Mint0Lands87696Sign = "0x9dee43b94c9fcf5d300ed876c52494d40b24a925c1c76c29db47f33bd41b739a2b109b0a3a876b2c38a7e6dee648008b830a43c779f041882f215bf7e88a89291c";
const Mint0Lands106107108109Sign = "0x9b18f4fa05ceb3c395f019d56d94dfcddcda9b18f4be5c39f62b1e12862d08c952ce246cc6598ff605e7379fb1a76b20b6146d5f5ac7042fda756e9cdc5a5b851c";

describe("HangOutLand", function () {
  let deployer: Signer;
  let mintSigner: Signer;
  let mintSigner2: Signer;
  let accountant: Signer;
  let accountant2: Signer;
  let unwhitelist: Signer;

  let HangOutLandFactory: ContractFactory;
  let hangOutLand: HangOutLand;

  before(async () => {
    let singers = await ethers.getSigners();
    [deployer, mintSigner, mintSigner2, accountant, accountant2, unwhitelist, ...singers] = singers;
    HangOutLandFactory = await ethers.getContractFactory("HangOutLand");
  });

  beforeEach(async () => {
    await hrt.network.provider.send("hardhat_reset");
  });

  context("Setting config", async () => {
    before(async () => {
    });

    beforeEach(async () => {
      hangOutLand = (await HangOutLandFactory.deploy(await mintSigner.getAddress(), await accountant.getAddress(), MerkleRoot)) as HangOutLand;
      await hangOutLand.deployed();
    });

    it("setSigner", async function () {
      expect((await hangOutLand.functions.signer())[0]).eq(await mintSigner.getAddress());
      await hangOutLand.setSigner(await mintSigner2.getAddress());
      expect((await hangOutLand.functions.signer())[0]).eq(await mintSigner2.getAddress());
      expect(hangOutLand.connect(mintSigner).setSigner(await mintSigner2.getAddress())).revertedWith("Ownable: caller is not the owner");
    });

    it("setMerkleRoot", async function() {
      expect(await hangOutLand.merkleRoot()).eq(MerkleRoot);
      await hangOutLand.setMerkleRoot(MerkleRoot2);
      expect(await hangOutLand.merkleRoot()).eq(MerkleRoot2);
      expect(hangOutLand.connect(mintSigner).setMerkleRoot(MerkleRoot)).revertedWith("Ownable: caller is not the owner");
    });

    it("setAccountant", async function() {
      expect(await hangOutLand.accountant()).eq(await accountant.getAddress());
      await hangOutLand.setAccountant(await accountant2.getAddress());
      expect(await hangOutLand.accountant()).eq(await accountant2.getAddress());
      expect(hangOutLand.connect(mintSigner).setAccountant(await accountant.getAddress())).revertedWith("Ownable: caller is not the owner");
    });

    it("setBaseURI", async function() {
      const baseURI = "URIString";
      expect(await hangOutLand.baseURI()).eq("");
      await hangOutLand.setBaseURI(baseURI);
      expect(await hangOutLand.baseURI()).eq(baseURI);
      expect(hangOutLand.connect(mintSigner).setBaseURI(baseURI+"2")).revertedWith("Ownable: caller is not the owner");
    });

    it("flipMintState", async function() {
      expect(await hangOutLand.openMint()).eq(false);
      await hangOutLand.flipMintState();
      expect(await hangOutLand.openMint()).eq(true);
      await hangOutLand.flipMintState();
      expect(await hangOutLand.openMint()).eq(false);
      expect(hangOutLand.connect(mintSigner).flipMintState()).revertedWith("Ownable: caller is not the owner");
    });
  });

  context("mintFieldWhitelist", async () => {
      before(async () => {
      });

      beforeEach(async () => {
        hangOutLand = (await HangOutLandFactory.deploy(await mintSigner.getAddress(), await accountant.getAddress(), MerkleRoot)) as HangOutLand;
        await hangOutLand.deployed();
      });

    it("should alright", async function() {
      await hangOutLand.flipMintState();
      await hangOutLand.mintFieldWhitelist(0, WhitelistMint0Field0Sign, Whitelist0Proof, {value: FieldPrice});
      expect(await hangOutLand.balanceOf(await deployer.getAddress())).eq(12);
      expect(await hangOutLand.totalSupply()).eq(12);
      expect(await hangOutLand.modelMintCount(0)).eq(2);
      expect(await hangOutLand.modelMintCount(1)).eq(4);
      expect(await hangOutLand.modelMintCount(2)).eq(6);
      expect(await hangOutLand.mintCountWhileField(await deployer.getAddress())).eq(12);
      expect(await hangOutLand.mintCountWhileLand(await deployer.getAddress())).eq(0);
    });

    it("not open", async function() {
      expect(hangOutLand.mintFieldWhitelist(0, WhitelistMint0Field0Sign, Whitelist0Proof, {value: FieldPrice})).revertedWith("mint not open");
    });

    it("invalid whitelist", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintFieldWhitelist(0, WhitelistMint0Field0Sign, Whitelist0InvalidProof, {value: FieldPrice})).revertedWith("invalid whitelist proof");
    });

    it("invalid mint signature", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintFieldWhitelist(0, WhitelistMintField0InvalidSign, Whitelist0Proof, {value: FieldPrice})).revertedWith("invalid minting signature");
    });

    it("not enough value", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintFieldWhitelist(0, WhitelistMintField0InvalidSign, Whitelist0Proof, {value: FieldPrice.div(2)})).revertedWith("not enough ether sent");
    });

    it("remint", async function() {
      await hangOutLand.flipMintState();
      await hangOutLand.connect(mintSigner).mintFieldWhitelist(0, WhitelistMint1Field0Sign, Whitelist1InvalidProof, {value: FieldPrice});
      expect(hangOutLand.mintFieldWhitelist(0, WhitelistMint0Field0Sign, Whitelist0Proof, {value: FieldPrice})).revertedWith("ERC721: token already minted");
    });

    // it("exceed max limit", async function() {
    //   await hangOutLand.flipMintState();
    //   const totalMaxSupply = await hangOutLand.totalMaxSupply();
    //   console.log("totalMaxSupply:", totalMaxSupply.toString());
    //   const end = parseInt(totalMaxSupply.toString());
    //   let begin = 0;
    //   let count = 1100;
    //   while (true) {
    //     if (begin + count > end) {
    //       count = end - begin;
    //     }
    //
    //     await hangOutLand.adminBatMint(begin, count);
    //     console.log('adminBatMint:', begin, count, 'finish');
    //
    //     if (begin + count >= end) {
    //       break;
    //     }
    //
    //     begin += count;
    //   }
    //
    //   expect(hangOutLand.mintFieldWhitelist(0, WhitelistMint0Field0Sign, Whitelist0Proof, {value: FieldPrice})).revertedWith("field id overrange");
    // });

    it("whitelist limit", async function() {
      await hangOutLand.flipMintState();
      await hangOutLand.mintFieldWhitelist(1, WhitelistMint0Field1Sign, Whitelist0Proof, {value: FieldPrice});
      expect(hangOutLand.mintFieldWhitelist(0, WhitelistMint0Field0Sign, Whitelist0Proof, {value: FieldPrice})).revertedWith("mint too many by one address");
    });

    it("invalid field", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintFieldWhitelist(InvalidField, WhitelistMint0Field7308Sign, Whitelist0Proof, {value: FieldPrice})).revertedWith("field id overrange");
    });

  });

  context("mintLandsWhitelist", async () => {
    before(async () => {
    });

    beforeEach(async () => {
      console.log("deployer transactionCount:", await deployer.getTransactionCount());
      hangOutLand = (await HangOutLandFactory.connect(deployer).deploy(await mintSigner.getAddress(), await accountant.getAddress(), MerkleRoot)) as HangOutLand;
      await hangOutLand.deployed();
    });

    it("should alright", async function() {
      await hangOutLand.flipMintState();
      await hangOutLand.mintLandsWhitelist(landIds100101102, WhitelistMint0Lands100101102Sign, Whitelist0Proof, {value: LandsPrice2Medium});
      expect(await hangOutLand.balanceOf(await deployer.getAddress())).eq(3);
      expect(await hangOutLand.totalSupply()).eq(3);
      expect(await hangOutLand.modelMintCount(0)).eq(0);
      expect(await hangOutLand.modelMintCount(1)).eq(2);
      expect(await hangOutLand.modelMintCount(2)).eq(1);
      expect(await hangOutLand.mintCountWhileField(await deployer.getAddress())).eq(0);
      expect(await hangOutLand.mintCountWhileLand(await deployer.getAddress())).eq(3);
    });

    it("not open", async function() {
      expect(hangOutLand.mintLandsWhitelist(landIds100101102, WhitelistMint0Lands100101102Sign, Whitelist0Proof, {value: LandsPrice2Medium})).revertedWith("mint not open");
    });

    it("invalid whitelist", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintLandsWhitelist(landIds100101102, WhitelistMint0Lands100101102Sign, Whitelist0InvalidProof, {value: LandsPrice2Medium})).revertedWith("invalid whitelist proof");
    });

    it("invalid mint signature", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintLandsWhitelist(landIds100101102, WhitelistMint0Lands100101InvalidSign, Whitelist0Proof, {value: LandsPrice2Medium})).revertedWith("invalid minting signature");
    });

    it("not enough value", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintFieldWhitelist(0, WhitelistMintField0InvalidSign, Whitelist0Proof, {value: LandsPrice2Medium.div(2)})).revertedWith("not enough ether sent");
    });

    it("remint", async function() {
      await hangOutLand.flipMintState();
      await hangOutLand.connect(mintSigner).mintLandsWhitelist(landIds100101102, WhitelistMint1Lands100101102Sign, Whitelist1Proof, {value: LandsPrice2Medium});
      expect(hangOutLand.mintLandsWhitelist(landIds100101102, WhitelistMint0Lands100101102Sign, Whitelist0Proof, {value: LandsPrice2Medium})).revertedWith("ERC721: token already minted");
    });

    // it("exceed max limit", async function() {
    //   await hangOutLand.flipMintState();
    //   const totalMaxSupply = await hangOutLand.totalMaxSupply();
    //   console.log("totalMaxSupply:", totalMaxSupply.toString());
    //   const end = parseInt(totalMaxSupply.toString());
    //   let begin = 0;
    //   let count = 1100;
    //   while (true) {
    //     if (begin + count > end) {
    //       count = end - begin;
    //     }
    //
    //     await hangOutLand.adminBatMint(begin, count);
    //     console.log('adminBatMint:', begin, count, 'finish');
    //
    //     if (begin + count >= end) {
    //       break;
    //     }
    //
    //     begin += count;
    //   }
    //
    //   expect(hangOutLand.mintLandsWhitelist(landIds87696, WhitelistMint0Lands87696Sign, Whitelist0Proof, {value: LandsPrice2Medium})).revertedWith("land id overrange");
    // });

    it("whitelist limit", async function() {
      await hangOutLand.flipMintState();
      await hangOutLand.mintLandsWhitelist(landIds103104105, WhitelistMint0Lands103104105Sign, Whitelist0Proof, {value: LandsPrice2Medium});
      expect(hangOutLand.mintLandsWhitelist(landIds100101102, WhitelistMint0Lands100101102Sign, Whitelist0Proof, {value: LandsPrice2Medium})).revertedWith("mint too many by one address");
    });

    it("per tx limit", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintLandsWhitelist(landIds106107108109, WhitelistMint0Lands106107108109Sign, Whitelist0Proof, {value: LandsPrice2Medium})).revertedWith("mint too many at a time");
    });
  })

  context("mintField", async () => {
    before(async () => {
      console.log("it before");
    });

    beforeEach(async () => {
      console.log("it beforeEach");
      hangOutLand = (await HangOutLandFactory.deploy(await mintSigner.getAddress(), await accountant.getAddress(), MerkleRoot)) as HangOutLand;
      await hangOutLand.deployed();
    });

    it("should alright", async function() {
      await hangOutLand.flipMintState();
      await hangOutLand.mintField(0, Mint0Field0Sign, {value: FieldPrice});
      expect(await hangOutLand.balanceOf(await deployer.getAddress())).eq(12);
      expect(await hangOutLand.totalSupply()).eq(12);
      expect(await hangOutLand.modelMintCount(0)).eq(2);
      expect(await hangOutLand.modelMintCount(1)).eq(4);
      expect(await hangOutLand.modelMintCount(2)).eq(6);
      expect(await hangOutLand.mintCountWhileField(await deployer.getAddress())).eq(0);
      expect(await hangOutLand.mintCountWhileLand(await deployer.getAddress())).eq(0);
    });

    it("not open", async function() {
      expect(hangOutLand.mintField(0, Mint0Field0Sign, {value: FieldPrice})).revertedWith("mint not open");
    });

    it("invalid mint signature", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintField(0, Mint0Field0InvalidSign, {value: FieldPrice})).revertedWith("invalid minting signature");
    });

    it("not enough value", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintField(0, Mint0Field0Sign, {value: FieldPrice.div(2)})).revertedWith("not enough ether sent");
    });

    it("remint", async function() {
      await hangOutLand.flipMintState();
      await hangOutLand.connect(mintSigner).mintField(0, Mint1Field0Sign, {value: FieldPrice});
      expect(hangOutLand.mintField(0, Mint0Field0Sign, {value: FieldPrice})).revertedWith("ERC721: token already minted");
    });

    // it("exceed max limit", async function() {
    //   await hangOutLand.flipMintState();
    //   const totalMaxSupply = await hangOutLand.totalMaxSupply();
    //   console.log("totalMaxSupply:", totalMaxSupply.toString());
    //   const end = parseInt(totalMaxSupply.toString());
    //   let begin = 0;
    //   let count = 1100;
    //   while (true) {
    //     if (begin + count > end) {
    //       count = end - begin;
    //     }
    //
    //     await hangOutLand.adminBatMint(begin, count);
    //     console.log('adminBatMint:', begin, count, 'finish');
    //
    //     if (begin + count >= end) {
    //       break;
    //     }
    //
    //     begin += count;
    //   }
    //
    //   expect(hangOutLand.mintField(InvalidField, Mint0Field7308Sign, {value: FieldPrice})).revertedWith("field id overrange");
    // });

    it("invalid field", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintField(InvalidField, Mint0Field7308Sign, {value: FieldPrice})).revertedWith("field id overrange");
    });

  })

  context("mintLands", async () => {
    before(async () => {
    });

    beforeEach(async () => {
      console.log("deployer transactionCount:", await deployer.getTransactionCount());
      hangOutLand = (await HangOutLandFactory.connect(deployer).deploy(await mintSigner.getAddress(), await accountant.getAddress(), MerkleRoot)) as HangOutLand;
      await hangOutLand.deployed();
    });

    it("should alright", async function() {
      await hangOutLand.flipMintState();
      await hangOutLand.mintLands(landIds100101102, Mint0Lands100101102Sign, {value: LandsPrice2Medium});
      expect(await hangOutLand.balanceOf(await deployer.getAddress())).eq(3);
      expect(await hangOutLand.totalSupply()).eq(3);
      expect(await hangOutLand.modelMintCount(0)).eq(0);
      expect(await hangOutLand.modelMintCount(1)).eq(2);
      expect(await hangOutLand.modelMintCount(2)).eq(1);
      expect(await hangOutLand.mintCountWhileField(await deployer.getAddress())).eq(0);
      expect(await hangOutLand.mintCountWhileLand(await deployer.getAddress())).eq(0);
    });

    it("not open", async function() {
      expect(hangOutLand.mintLands(landIds100101102, Mint0Lands100101102Sign, {value: LandsPrice2Medium})).revertedWith("mint not open");
    });

    it("invalid mint signature", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintLands(landIds100101102, Mint0Lands100101102InvalidSign, {value: LandsPrice2Medium})).revertedWith("invalid minting signature");
    });

    it("not enough value", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintLands(landIds100101102, Mint0Lands100101102Sign, {value: LandsPrice2Medium.div(2)})).revertedWith("not enough ether sent");
    });

    it("remint", async function() {
      await hangOutLand.flipMintState();
      await hangOutLand.mintLands(landIds100101102, Mint0Lands100101102Sign, {value: LandsPrice2Medium});
      expect(hangOutLand.mintLands(landIds100101102, Mint0Lands100101102Sign, {value: LandsPrice2Medium})).revertedWith("ERC721: token already minted");
    });

    // it("exceed max limit", async function() {
    //   await hangOutLand.flipMintState();
    //   const totalMaxSupply = await hangOutLand.totalMaxSupply();
    //   console.log("totalMaxSupply:", totalMaxSupply.toString());
    //   const end = parseInt(totalMaxSupply.toString());
    //   let begin = 0;
    //   let count = 1100;
    //   while (true) {
    //     if (begin + count > end) {
    //       count = end - begin;
    //     }
    //
    //     await hangOutLand.adminBatMint(begin, count);
    //     console.log('adminBatMint:', begin, count, 'finish');
    //
    //     if (begin + count >= end) {
    //       break;
    //     }
    //
    //     begin += count;
    //   }
    //
    //   expect(hangOutLand.mintLands(landIds87696, Mint0Lands87696Sign, {value: LandsPrice2Medium})).revertedWith("land id overrange");
    // });

    it("per tx limit", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintLands(landIds106107108109, Mint0Lands106107108109Sign, {value: LandsPrice2Medium})).revertedWith("mint too many at a time");
    });

    it("per tx limit", async function() {
      await hangOutLand.flipMintState();
      expect(hangOutLand.mintLands(landIds87696, Mint0Lands87696Sign, {value: LandsPrice2Medium})).revertedWith("land id overrange");
    });

  });

  context("withdraw", async () => {
    before(async () => {
    });

    beforeEach(async () => {
      hangOutLand = (await HangOutLandFactory.deploy(await mintSigner.getAddress(), await accountant.getAddress(), MerkleRoot)) as HangOutLand;
      await hangOutLand.deployed();

      await hangOutLand.flipMintState();
      await hangOutLand.mintField(0, Mint0Field0Sign, {value: FieldPrice});
    });

    it("should alright", async function() {
      console.log(await ethers.provider.getBalance(hangOutLand.address));
      expect(await ethers.provider.getBalance(hangOutLand.address)).eq(FieldPrice);
      let receiverBeforeBalance = await mintSigner.getBalance();
      console.log(receiverBeforeBalance);
      await hangOutLand.connect(accountant).withdraw(await mintSigner.getAddress(), FieldPrice);
      console.log(await ethers.provider.getBalance(hangOutLand.address));
      console.log(await mintSigner.getBalance());
      expect(await ethers.provider.getBalance(hangOutLand.address)).eq(ethers.BigNumber.from(0));
      expect(await mintSigner.getBalance()).eq(receiverBeforeBalance.add(FieldPrice));
    });

    it("withdraw half", async function() {
      console.log(await ethers.provider.getBalance(hangOutLand.address));
      expect(await ethers.provider.getBalance(hangOutLand.address)).eq(FieldPrice);
      let receiverBeforeBalance = await mintSigner.getBalance();
      console.log(receiverBeforeBalance);
      await hangOutLand.connect(accountant).withdraw(await mintSigner.getAddress(), FieldPrice.div(2));
      console.log(await ethers.provider.getBalance(hangOutLand.address));
      console.log(await mintSigner.getBalance());
      expect(await ethers.provider.getBalance(hangOutLand.address)).eq(FieldPrice.div(2));
      expect(await mintSigner.getBalance()).eq(receiverBeforeBalance.add(FieldPrice.div(2)));
    });

    it("not accountant", async function() {
      expect(hangOutLand.withdraw(await mintSigner.getAddress(), FieldPrice)).revertedWith("caller is not the accountant");
    });

    it("exceed amount", async function() {
      // await hangOutLand.connect(accountant).withdraw(await mintSigner.getAddress(), FieldPrice.mul(2));
      expect(hangOutLand.connect(accountant).withdraw(await mintSigner.getAddress(), FieldPrice.mul(2))).revertedWith("");
    });

  });
});
