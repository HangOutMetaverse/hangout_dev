import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, ContractFactory, Signer, utils } from "ethers";
const hrt = require("hardhat");

import {HangOutETHFlatland} from "../typechain/HangOutETHFlatland";
import { it } from "mocha";
import { createEvalAwarePartialHost } from "ts-node/dist/repl";
import { waffleChai } from "@nomiclabs/hardhat-waffle/dist/src/waffle-chai";

const PlotsCountPerScene = 16;
const LargePlotCountPerScene = 4;
const MediumPlotCountPerScene = 6;
const SmallPlotCountPerScene = 6;

const SceneMerkleRoot = "0x8290649546c9677bc983aedb38eb324d997a6be9a17a8e0a9bda52a87ae39f97";
const SceneMerkleRoot2 = "0x267874771e0604c1bfa2d5b6980ee4b82f3e246f314fc4095c9470e4cf50f14c";

const PlotsMerkleRoot = "0x8290649546c9677bc983aedb38eb324d997a6be9a17a8e0a9bda52a87ae39f97";
const PlotsMerkleRoot2 = "0x267874771e0604c1bfa2d5b6980ee4b82f3e246f314fc4095c9470e4cf50f14c";

const WhitelistMint0Scene0Sign = "0x31a63495733edf1397146eb0f30a9f8fb7355d2e9fa54a922f89a1267503933c5495c5ae60ab4eecfab8729d11bce0b54728782e659b54f3b24814e29fade6e91c";
const WhitelistMint0Scene1Sign = "0x8a083f5561c1ab0f1da969632a4d6c7608603b7c2bf9e8179dc98bdfbca18d6a07b713f87cb4814b8c9321d9a3fd233fc23a64be3fdf75362c321645a5d074b01c";
const WhitelistMintScene0InvalidSign = "0x43a8cccd008550fc1edd0e5c02e0f3082615a5131dd2cecc85ab081c20916943387d9b58fe4e72607ded39f52813d11e3a7824e2ba13cff975004096183a4cc81b";

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


const WhitelistMint1Scene0Sign = "0x9d3100d6cc36d90922b103a0162a3bb0bd08c42724233cfecf4278bdf873c7561daa7ac821a0499886f0035f3ab6b930a97c3af7b724faf9923d6411100c48781b";

const Whitelist1InvalidProof = [
    '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    '0x2cf0dbd9ac78a342813bd3c9aa40cb98bfeabe426236fcd7575dda06e61310c7',
    '0x00000000000000000000000015d34aaf54267db7d7c367839aaf71a00a2c6a65'
];

const plotIds100101102 = [100, 101, 102];
const WhitelistMint0Plots100101102Sign = "0x0d09a98cff2392843f71b30b2688de973950b482f70df60652076292d403af6a5b7ab4e7d31414e465ac7cb77418bfbdc90cc08cdc8bdebbc099548e55ee68541b";
const WhitelistMint0Plots100101InvalidSign = "0x8613c2c6019f39e89c2aaa7fe1955155a59679098396ac6fcd4d588ae7bd435a4eb80495ad94ba18222900d6ffd755b5e554a78202b85c22760dd300d7172f2e1b";
const WhitelistMint1Plots100101102Sign = "0x25081f94f3325ca1d7beb9cba050439ae4afb86257d6c0e4b530e9f46a4d421b7567a0796b3ed239eda823b39a5313f51c3b240c09a01611444002c71ef58b071c";

const plotIds103104105 = [103, 104, 105];
const WhitelistMint0Plots103104105Sign = "0x4076b1bedf9f53d2201d45301e45a63fb29b432d013716eb2d92ac016530cbef00242b3bae87aba0c3b6a706d4911bd2632c82617b44623690b6c9d9ac34665b1b";

const plotIds106107108109 = [106, 107, 108, 109];
const WhitelistMint0Plots106107108109Sign = "0x8c5207296aaef1c5ac55958bb5185d0fc1144341f7de8516f1680a65d1d26b9946daee62e4887b2dad067717db678cfadcee3a4dfb19d8c6d76d0da8d9338cbf1b";

const plotIds5904 = [5904];
const WhitelistMint0Plots5904Sign = "0x4460c7459b6b44109d898000c7e235efac96cd5a5b3a5d03093217b1be71450e1af65a7f1ec7162b0c6e6ba61cb38a8e3fb914e50e6fbb53aa0e940ce7accf411c";

const superLargePrice = ethers.utils.parseEther("0.5");
const grandePrice = ethers.utils.parseEther("0.26");
const standardPrice = ethers.utils.parseEther("0.18");
const ScenePrice = superLargePrice.mul(4).add(grandePrice.mul(6)).add(standardPrice.mul(6));
const PlotsPrice2Medium = superLargePrice.add(grandePrice.mul(2));

const InvalidScene = 369;
const WhitelistMint0Scene7308Sign = "0xde612bc37bad32da74a07eceab667de589a9fa4bfde3a66937fd19bf081e282726ed230cd8bc91b6eb55552c0eb494d91dd90bdf0f95f3da68e9792a1942f8a21c";


const Mint0Scene0Sign = "0x060f8fec11e6fc66eac9ec1ec7baa69be52baab16bac69d0d2ec6804706020e2506b7d122b84a069420569d01cb018588c40eab3703c59eb0bea732727c8e1871b";
const Mint0Scene0InvalidSign = "0x897733ca27730759b892a926596acc834dd6caf73ce0a63f809cb833fc4db10c764117b3f4a38ceaf1b08e6ef865a7029495a66692e1ed023e2765870b9af5c91c";
const Mint0Scene326Sign = "0x192bd479e045f3ca6d3e0276a598243e875513b175c3043fb4e514c6c4be5acb7674a7e21e18937ae2a7a17ffe66bcef6b89bcf43d1077b5ae4093a94b0f2b0d1c";

const Mint1Scene0Sign = "0x6318e21db8ba08f62e802a638ad98b48f2f89ea3728d9410a3ec128058f317ce6c746ee57b491ddd41dca4b1ec6d4f46bfbaa84c768cd54fd9cd53d19b3b45291c";
const Mint0Plots100101102Sign = "0x60e3101c5d646b07220eac0771357350eae14b08d2ff9c173e97077ca03943da6e9fc21d3d9d9ee702fbe4fdc7a06d4f7462db4818d9035483292c5b526840651b";
const Mint0Plots100101102InvalidSign = "0xd28fc9e49b7930f198a3dd0cde0189d88f20d3b4d67b2d1f21824942e3d1acc56d1509379482b190d5235ee3924e6fbf52fe265e23f342dde20edfbcc8b30e021c";

// const Mint0Slots3912Sign = "0x2a0072e2db5e2e38e6b150546c35f89eced5f39eca1050f16ae91de5fa67d2cf72a387fee94ff56ec7e505762e1b7af09f120766f47b7e246cd28b0be4d656111b";
const Mint0Slots5904Sign = "0x7322012e4cbe50d630bd4e91ca95afd7bd8661597015056248a0e9de39bc96e3573945ac3bf84d8a6d095a6220cb076e03e6c02bb65ac060e513f911b953a54f1b";
const Mint0Plots106107108109Sign = "0x5c5ed3deb384ccb94314b1ce7039ceae871bba77ff2046d5c412663026fcddf530a3309924a06d4759e3f35ce9cb81d1c15a40a1136d5b47d3d09977985d72541c";

describe("HangOutETHFlatland", function () {
  let deployer: Signer;
  let mintSigner: Signer;
  let mintSigner2: Signer;
  let unwhitelist: Signer;

  let HangOutETHFlatlandFactory: ContractFactory;
  let hangOutETHFlatland: HangOutETHFlatland;

  before(async () => {
    let singers = await ethers.getSigners();
    [deployer, mintSigner, mintSigner2, unwhitelist, ...singers] = singers;
    console.log("deployer:", await deployer.getAddress());
    console.log("mintSigner:", await mintSigner.getAddress());
    console.log("mintSigner2:", await mintSigner2.getAddress());
    console.log("unwhitelist:", await unwhitelist.getAddress());
    HangOutETHFlatlandFactory = await ethers.getContractFactory("HangOutETHFlatland");
  });

  beforeEach(async () => {
    await hrt.network.provider.send("hardhat_reset");
  });

  context("Setting config", async () => {
    before(async () => {
    });

    beforeEach(async () => {
      hangOutETHFlatland = (await HangOutETHFlatlandFactory.deploy(await mintSigner.getAddress(), SceneMerkleRoot, PlotsMerkleRoot)) as HangOutETHFlatland;
      await hangOutETHFlatland.deployed();
    });

    it("setPrice", async function() {
      expect(await hangOutETHFlatland.superLargePrice()).eq(ethers.utils.parseEther("0.5"));
      expect(await hangOutETHFlatland.grandePrice()).eq(ethers.utils.parseEther("0.26"));
      expect(await hangOutETHFlatland.standardPrice()).eq(ethers.utils.parseEther("0.18"));
      await hangOutETHFlatland.setPrices(
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("2"),
        ethers.utils.parseEther("3")
      );
      expect(await hangOutETHFlatland.superLargePrice()).eq(ethers.utils.parseEther("1"));
      expect(await hangOutETHFlatland.grandePrice()).eq(ethers.utils.parseEther("2"));
      expect(await hangOutETHFlatland.standardPrice()).eq(ethers.utils.parseEther("3"));
      expect(hangOutETHFlatland.connect(mintSigner).setPrices(
        ethers.utils.parseEther("10"),
        ethers.utils.parseEther("20"),
        ethers.utils.parseEther("30")
      )).revertedWith("Ownable: caller is not the owner");
    });

    it("setMaxLimit", async function() {
      expect(await hangOutETHFlatland.maxSceneOneAddr()).eq(2);
      expect(await hangOutETHFlatland.maxPlotOneAddr()).eq(16);
      expect(await hangOutETHFlatland.txMaxPlots()).eq(16);
      let maxLimitInfo = await hangOutETHFlatland.getMaxLimit(await deployer.getAddress())
      expect(maxLimitInfo[0]).eq(2);
      expect(maxLimitInfo[1]).eq(16);
      expect(maxLimitInfo[2]).eq(16);
      expect(maxLimitInfo[3]).eq(0);
      expect(maxLimitInfo[4]).eq(0);

      await hangOutETHFlatland.setMaxLimit(100, 200, 300);
      expect(await hangOutETHFlatland.maxSceneOneAddr()).eq(100);
      expect(await hangOutETHFlatland.maxPlotOneAddr()).eq(200);
      expect(await hangOutETHFlatland.txMaxPlots()).eq(300);

      maxLimitInfo = await hangOutETHFlatland.getMaxLimit(await deployer.getAddress())
      expect(maxLimitInfo[0]).eq(100);
      expect(maxLimitInfo[1]).eq(200);
      expect(maxLimitInfo[2]).eq(300);
      expect(maxLimitInfo[3]).eq(0);
      expect(maxLimitInfo[4]).eq(0);

      expect(hangOutETHFlatland.connect(mintSigner).setMaxLimit(
        1,
        2,
        3
      )).revertedWith("Ownable: caller is not the owner");
    });

    it("setSigner", async function () {
      expect((await hangOutETHFlatland.functions.signer())[0]).eq(await mintSigner.getAddress());
      await hangOutETHFlatland.setSigner(await mintSigner2.getAddress());
      expect((await hangOutETHFlatland.functions.signer())[0]).eq(await mintSigner2.getAddress());
      expect(hangOutETHFlatland.connect(mintSigner).setSigner(await mintSigner2.getAddress())).revertedWith("Ownable: caller is not the owner");
    });

    it("setMerkleRoot", async function() {
      expect(await hangOutETHFlatland.sceneMerkleRoot()).eq(SceneMerkleRoot);
      expect(await hangOutETHFlatland.plotsMerkleRoot()).eq(PlotsMerkleRoot);

      await hangOutETHFlatland.setMerkleRoots(SceneMerkleRoot2, PlotsMerkleRoot2);
      expect(await hangOutETHFlatland.sceneMerkleRoot()).eq(SceneMerkleRoot2);
      expect(await hangOutETHFlatland.plotsMerkleRoot()).eq(PlotsMerkleRoot2);

      expect(hangOutETHFlatland.connect(mintSigner).setMerkleRoots(SceneMerkleRoot, PlotsMerkleRoot)).revertedWith("Ownable: caller is not the owner");
    });

    it("setBaseURI", async function() {
      const baseURI = "URIString";
      expect(await hangOutETHFlatland.baseURI()).eq("");
      await hangOutETHFlatland.setBaseURI(baseURI);
      expect(await hangOutETHFlatland.baseURI()).eq(baseURI);
      expect(hangOutETHFlatland.connect(mintSigner).setBaseURI(baseURI+"2")).revertedWith("Ownable: caller is not the owner");
    });

    it("flipMintState", async function() {
      expect(await hangOutETHFlatland.openMint()).eq(false);
      await hangOutETHFlatland.flipMintState();
      expect(await hangOutETHFlatland.openMint()).eq(true);
      await hangOutETHFlatland.flipMintState();
      expect(await hangOutETHFlatland.openMint()).eq(false);
      expect(hangOutETHFlatland.connect(mintSigner).flipMintState()).revertedWith("Ownable: caller is not the owner");
    });
  });

  context("mintSceneWhitelist", async () => {
      before(async () => {
      });

      beforeEach(async () => {
        hangOutETHFlatland = (await HangOutETHFlatlandFactory.deploy(await mintSigner.getAddress(), SceneMerkleRoot, PlotsMerkleRoot)) as HangOutETHFlatland;
        await hangOutETHFlatland.deployed();
      });

    it("should alright", async function() {
      await hangOutETHFlatland.flipMintState();
      await hangOutETHFlatland.mintSceneWhitelist(0, WhitelistMint0Scene0Sign, Whitelist0Proof, {value: ScenePrice});
      expect(await hangOutETHFlatland.balanceOf(await deployer.getAddress())).eq(PlotsCountPerScene);
      expect(await hangOutETHFlatland.totalSupply()).eq(PlotsCountPerScene);
      expect(await hangOutETHFlatland.modelMintCount(0)).eq(LargePlotCountPerScene);
      expect(await hangOutETHFlatland.modelMintCount(1)).eq(MediumPlotCountPerScene);
      expect(await hangOutETHFlatland.modelMintCount(2)).eq(SmallPlotCountPerScene);
      expect(await hangOutETHFlatland.mintedSceneCount(await deployer.getAddress())).eq(1);
      expect(await hangOutETHFlatland.mintedPlotCount(await deployer.getAddress())).eq(0);

      let maxLimitInfo = await hangOutETHFlatland.getMaxLimit(await deployer.getAddress())
      expect(maxLimitInfo[0]).eq(2);
      expect(maxLimitInfo[1]).eq(16);
      expect(maxLimitInfo[2]).eq(16);
      expect(maxLimitInfo[3]).eq(1);
      expect(maxLimitInfo[4]).eq(0);
    });

    it("not open", async function() {
      expect(hangOutETHFlatland.mintSceneWhitelist(0, WhitelistMint0Scene0Sign, Whitelist0Proof, {value: ScenePrice})).revertedWith("mint not open");
    });

    it("invalid whitelist", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintSceneWhitelist(0, WhitelistMint0Scene0Sign, Whitelist0InvalidProof, {value: ScenePrice})).revertedWith("invalid whitelist proof");
    });

    it("invalid mint signature", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintSceneWhitelist(0, WhitelistMintScene0InvalidSign, Whitelist0Proof, {value: ScenePrice})).revertedWith("invalid minting signature");
    });

    it("not enough value", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintSceneWhitelist(0, WhitelistMintScene0InvalidSign, Whitelist0Proof, {value: ScenePrice.div(2)})).revertedWith("not enough ether sent");
    });

    it("remint", async function() {
      await hangOutETHFlatland.flipMintState();
      await hangOutETHFlatland.connect(mintSigner).mintSceneWhitelist(0, WhitelistMint1Scene0Sign, Whitelist1InvalidProof, {value: ScenePrice});
      expect(hangOutETHFlatland.mintSceneWhitelist(0, WhitelistMint0Scene0Sign, Whitelist0Proof, {value: ScenePrice})).revertedWith("ERC721: token already minted");
    });

    // it("exceed max limit", async function() {
    //   await hangOutETHFlatland.flipMintState();
    //   const totalMaxSupply = await hangOutETHFlatland.totalMaxSupply();
    //   console.log("totalMaxSupply:", totalMaxSupply.toString());
    //   const end = parseInt(totalMaxSupply.toString());
    //   let begin = 0;
    //   let count = 1100;
    //   while (true) {
    //     if (begin + count > end) {
    //       count = end - begin;
    //     }
    //
    //     await hangOutETHFlatland.adminBatMint(begin, count);
    //     console.log('adminBatMint:', begin, count, 'finish');
    //
    //     if (begin + count >= end) {
    //       break;
    //     }
    //
    //     begin += count;
    //   }
    //
    //   expect(hangOutETHFlatland.mintSceneWhitelist(0, WhitelistMint0Scene0Sign, Whitelist0Proof, {value: ScenePrice})).revertedWith("scene id overrange");
    // });

    it("whitelist limit", async function() {
      await hangOutETHFlatland.flipMintState();
      await hangOutETHFlatland.mintSceneWhitelist(1, WhitelistMint0Scene1Sign, Whitelist0Proof, {value: ScenePrice});
      expect(hangOutETHFlatland.mintSceneWhitelist(0, WhitelistMint0Scene0Sign, Whitelist0Proof, {value: ScenePrice})).revertedWith("mint too many by one address");
    });

    it("invalid scene", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintSceneWhitelist(InvalidScene, WhitelistMint0Scene7308Sign, Whitelist0Proof, {value: ScenePrice})).revertedWith("scene id overrange");
    });

  });

  context("mintPlotsWhitelist", async () => {
    before(async () => {
    });

    beforeEach(async () => {
      console.log("deployer transactionCount:", await deployer.getTransactionCount());
      hangOutETHFlatland = (await HangOutETHFlatlandFactory.connect(deployer).deploy(await mintSigner.getAddress(), SceneMerkleRoot, PlotsMerkleRoot)) as HangOutETHFlatland;
      await hangOutETHFlatland.deployed();
    });

    it("should alright", async function() {
      await hangOutETHFlatland.flipMintState();
      await hangOutETHFlatland.mintPlotsWhitelist(plotIds100101102, WhitelistMint0Plots100101102Sign, Whitelist0Proof, {value: PlotsPrice2Medium});
      expect(await hangOutETHFlatland.balanceOf(await deployer.getAddress())).eq(3);
      expect(await hangOutETHFlatland.totalSupply()).eq(3);
      expect(await hangOutETHFlatland.modelMintCount(0)).eq(0);
      expect(await hangOutETHFlatland.modelMintCount(1)).eq(3);
      expect(await hangOutETHFlatland.modelMintCount(2)).eq(0);
      expect(await hangOutETHFlatland.mintedSceneCount(await deployer.getAddress())).eq(0);
      expect(await hangOutETHFlatland.mintedPlotCount(await deployer.getAddress())).eq(3);

      let maxLimitInfo = await hangOutETHFlatland.getMaxLimit(await deployer.getAddress())
      expect(maxLimitInfo[0]).eq(2);
      expect(maxLimitInfo[1]).eq(16);
      expect(maxLimitInfo[2]).eq(16);
      expect(maxLimitInfo[3]).eq(0);
      expect(maxLimitInfo[4]).eq(3);
    });

    it("not open", async function() {
      expect(hangOutETHFlatland.mintPlotsWhitelist(plotIds100101102, WhitelistMint0Plots100101102Sign, Whitelist0Proof, {value: PlotsPrice2Medium})).revertedWith("mint not open");
    });

    it("invalid whitelist", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintPlotsWhitelist(plotIds100101102, WhitelistMint0Plots100101102Sign, Whitelist0InvalidProof, {value: PlotsPrice2Medium})).revertedWith("invalid whitelist proof");
    });

    it("invalid mint signature", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintPlotsWhitelist(plotIds100101102, WhitelistMint0Plots100101InvalidSign, Whitelist0Proof, {value: PlotsPrice2Medium})).revertedWith("invalid minting signature");
    });

    it("not enough value", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintSceneWhitelist(0, WhitelistMintScene0InvalidSign, Whitelist0Proof, {value: PlotsPrice2Medium.div(2)})).revertedWith("not enough ether sent");
    });

    it("remint", async function() {
      await hangOutETHFlatland.flipMintState();
      await hangOutETHFlatland.connect(mintSigner).mintPlotsWhitelist(plotIds100101102, WhitelistMint1Plots100101102Sign, Whitelist1Proof, {value: PlotsPrice2Medium});
      expect(hangOutETHFlatland.mintPlotsWhitelist(plotIds100101102, WhitelistMint0Plots100101102Sign, Whitelist0Proof, {value: PlotsPrice2Medium})).revertedWith("ERC721: token already minted");
    });

    // it("exceed max limit", async function() {
    //   await hangOutETHFlatland.flipMintState();
    //   const totalMaxSupply = await hangOutETHFlatland.totalMaxSupply();
    //   console.log("totalMaxSupply:", totalMaxSupply.toString());
    //   const end = parseInt(totalMaxSupply.toString());
    //   let begin = 0;
    //   let count = 1100;
    //   while (true) {
    //     if (begin + count > end) {
    //       count = end - begin;
    //     }
    //
    //     await hangOutETHFlatland.adminBatMint(begin, count);
    //     console.log('adminBatMint:', begin, count, 'finish');
    //
    //     if (begin + count >= end) {
    //       break;
    //     }
    //
    //     begin += count;
    //   }
    //
    //   expect(hangOutETHFlatland.mintPlotsWhitelist(plotIds5904, WhitelistMint0Plots5904Sign, Whitelist0Proof, {value: PlotsPrice2Medium})).revertedWith("plot id overrange");
    // });

    it("whitelist limit", async function() {
      await hangOutETHFlatland.flipMintState();
      await hangOutETHFlatland.mintPlotsWhitelist(plotIds103104105, WhitelistMint0Plots103104105Sign, Whitelist0Proof, {value: PlotsPrice2Medium});
      expect(hangOutETHFlatland.mintPlotsWhitelist(plotIds100101102, WhitelistMint0Plots100101102Sign, Whitelist0Proof, {value: PlotsPrice2Medium})).revertedWith("mint too many by one address");
    });

    it("per tx limit", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintPlotsWhitelist(plotIds106107108109, WhitelistMint0Plots106107108109Sign, Whitelist0Proof, {value: PlotsPrice2Medium})).revertedWith("mint too many at a time");
    });
  })

  context("mintScene", async () => {
    before(async () => {
      console.log("it before");
    });

    beforeEach(async () => {
      console.log("it beforeEach");
      hangOutETHFlatland = (await HangOutETHFlatlandFactory.deploy(await mintSigner.getAddress(), SceneMerkleRoot, PlotsMerkleRoot)) as HangOutETHFlatland;
      await hangOutETHFlatland.deployed();
    });

    it("should alright", async function() {
      await hangOutETHFlatland.flipMintState();
      await hangOutETHFlatland.mintScene(0, Mint0Scene0Sign, {value: ScenePrice});
      expect(await hangOutETHFlatland.balanceOf(await deployer.getAddress())).eq(PlotsCountPerScene);
      expect(await hangOutETHFlatland.totalSupply()).eq(PlotsCountPerScene);
      expect(await hangOutETHFlatland.modelMintCount(0)).eq(LargePlotCountPerScene);
      expect(await hangOutETHFlatland.modelMintCount(1)).eq(MediumPlotCountPerScene);
      expect(await hangOutETHFlatland.modelMintCount(2)).eq(SmallPlotCountPerScene);
      expect(await hangOutETHFlatland.mintedSceneCount(await deployer.getAddress())).eq(1);
      expect(await hangOutETHFlatland.mintedPlotCount(await deployer.getAddress())).eq(0);

      let maxLimitInfo = await hangOutETHFlatland.getMaxLimit(await deployer.getAddress())
      expect(maxLimitInfo[0]).eq(2);
      expect(maxLimitInfo[1]).eq(16);
      expect(maxLimitInfo[2]).eq(16);
      expect(maxLimitInfo[3]).eq(1);
      expect(maxLimitInfo[4]).eq(0);
    });

    it("not open", async function() {
      expect(hangOutETHFlatland.mintScene(0, Mint0Scene0Sign, {value: ScenePrice})).revertedWith("mint not open");
    });

    it("invalid mint signature", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintScene(0, Mint0Scene0InvalidSign, {value: ScenePrice})).revertedWith("invalid minting signature");
    });

    it("not enough value", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintScene(0, Mint0Scene0Sign, {value: ScenePrice.div(2)})).revertedWith("not enough ether sent");
    });

    it("remint", async function() {
      await hangOutETHFlatland.flipMintState();
      await hangOutETHFlatland.connect(mintSigner).mintScene(0, Mint1Scene0Sign, {value: ScenePrice});
      expect(hangOutETHFlatland.mintScene(0, Mint0Scene0Sign, {value: ScenePrice})).revertedWith("ERC721: token already minted");
    });

    // it("exceed max limit", async function() {
    //   await hangOutETHFlatland.flipMintState();
    //   const totalMaxSupply = await hangOutETHFlatland.totalMaxSupply();
    //   console.log("totalMaxSupply:", totalMaxSupply.toString());
    //   const end = parseInt(totalMaxSupply.toString());
    //   let begin = 0;
    //   let count = 1100;
    //   while (true) {
    //     if (begin + count > end) {
    //       count = end - begin;
    //     }
    //
    //     await hangOutETHFlatland.adminBatMint(begin, count);
    //     console.log('adminBatMint:', begin, count, 'finish');
    //
    //     if (begin + count >= end) {
    //       break;
    //     }
    //
    //     begin += count;
    //   }
    //
    //   expect(hangOutETHFlatland.mintScene(InvalidScene, Mint0Scene326Sign, {value: ScenePrice})).revertedWith("scene id overrange");
    // });

    it("invalid scene", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintScene(InvalidScene, Mint0Scene326Sign, {value: ScenePrice})).revertedWith("scene id overrange");
    });

  })

  context("mintPlots", async () => {
    before(async () => {
    });

    beforeEach(async () => {
      console.log("deployer transactionCount:", await deployer.getTransactionCount());
      hangOutETHFlatland = (await HangOutETHFlatlandFactory.connect(deployer).deploy(await mintSigner.getAddress(), SceneMerkleRoot, PlotsMerkleRoot)) as HangOutETHFlatland;
      await hangOutETHFlatland.deployed();
    });

    it("should alright", async function() {
      await hangOutETHFlatland.flipMintState();
      await hangOutETHFlatland.mintPlots(plotIds100101102, Mint0Plots100101102Sign, {value: PlotsPrice2Medium});
      expect(await hangOutETHFlatland.balanceOf(await deployer.getAddress())).eq(3);
      expect(await hangOutETHFlatland.totalSupply()).eq(3);
      expect(await hangOutETHFlatland.modelMintCount(0)).eq(0);
      expect(await hangOutETHFlatland.modelMintCount(1)).eq(3);
      expect(await hangOutETHFlatland.modelMintCount(2)).eq(0);
      expect(await hangOutETHFlatland.mintedSceneCount(await deployer.getAddress())).eq(0);
      expect(await hangOutETHFlatland.mintedPlotCount(await deployer.getAddress())).eq(3);

      let maxLimitInfo = await hangOutETHFlatland.getMaxLimit(await deployer.getAddress())
      expect(maxLimitInfo[0]).eq(2);
      expect(maxLimitInfo[1]).eq(16);
      expect(maxLimitInfo[2]).eq(16);
      expect(maxLimitInfo[3]).eq(0);
      expect(maxLimitInfo[4]).eq(3);
    });

    it("not open", async function() {
      expect(hangOutETHFlatland.mintPlots(plotIds100101102, Mint0Plots100101102Sign, {value: PlotsPrice2Medium})).revertedWith("mint not open");
    });

    it("invalid mint signature", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintPlots(plotIds100101102, Mint0Plots100101102InvalidSign, {value: PlotsPrice2Medium})).revertedWith("invalid minting signature");
    });

    it("not enough value", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintPlots(plotIds100101102, Mint0Plots100101102Sign, {value: PlotsPrice2Medium.div(2)})).revertedWith("not enough ether sent");
    });

    it("remint", async function() {
      await hangOutETHFlatland.flipMintState();
      await hangOutETHFlatland.mintPlots(plotIds100101102, Mint0Plots100101102Sign, {value: PlotsPrice2Medium});
      expect(hangOutETHFlatland.mintPlots(plotIds100101102, Mint0Plots100101102Sign, {value: PlotsPrice2Medium})).revertedWith("ERC721: token already minted");
    });

    // it("exceed max limit", async function() {
    //   await hangOutETHFlatland.flipMintState();
    //   const totalMaxSupply = await hangOutETHFlatland.totalMaxSupply();
    //   console.log("totalMaxSupply:", totalMaxSupply.toString());
    //   const end = parseInt(totalMaxSupply.toString());
    //   let begin = 0;
    //   let count = 1100;
    //   while (true) {
    //     if (begin + count > end) {
    //       count = end - begin;
    //     }
    //
    //     await hangOutETHFlatland.adminBatMint(begin, count);
    //     console.log('adminBatMint:', begin, count, 'finish');
    //
    //     if (begin + count >= end) {
    //       break;
    //     }
    //
    //     begin += count;
    //   }
    //
    //   expect(hangOutETHFlatland.mintPlots(plotIds5904, Mint0Slots5904Sign, {value: PlotsPrice2Medium})).revertedWith("plot id overrange");
    // });

    it("per tx limit", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintPlots(plotIds106107108109, Mint0Plots106107108109Sign, {value: PlotsPrice2Medium})).revertedWith("mint too many at a time");
    });

    it("per tx limit", async function() {
      await hangOutETHFlatland.flipMintState();
      expect(hangOutETHFlatland.mintPlots(plotIds5904, Mint0Slots5904Sign, {value: PlotsPrice2Medium})).revertedWith("plot id overrange");
    });

  });

  context("mintReserved", async () => {
   before(async () => {
   });

   beforeEach(async () => {
     console.log("deployer transactionCount:", await deployer.getTransactionCount());
     hangOutETHFlatland = (await HangOutETHFlatlandFactory.connect(deployer).deploy(await mintSigner.getAddress(), SceneMerkleRoot, PlotsMerkleRoot)) as HangOutETHFlatland;
     await hangOutETHFlatland.deployed();
   });

    it("should alright", async function() {
      await hangOutETHFlatland.flipMintState();

      let sceneIds = [0, 1];
      await hangOutETHFlatland.mintReserved(sceneIds);
      expect(await hangOutETHFlatland.totalSupply()).eq(PlotsCountPerScene * sceneIds.length);
      expect(await hangOutETHFlatland.modelMintCount(0)).eq(LargePlotCountPerScene * sceneIds.length);
      expect(await hangOutETHFlatland.modelMintCount(1)).eq(MediumPlotCountPerScene * sceneIds.length);
      expect(await hangOutETHFlatland.modelMintCount(2)).eq(SmallPlotCountPerScene * sceneIds.length);
      expect(await hangOutETHFlatland.mintedSceneCount(await deployer.getAddress())).eq(0);
      expect(await hangOutETHFlatland.mintedPlotCount(await deployer.getAddress())).eq(0);

      let maxLimitInfo = await hangOutETHFlatland.getMaxLimit(await deployer.getAddress())
      expect(maxLimitInfo[0]).eq(2);
      expect(maxLimitInfo[1]).eq(16);
      expect(maxLimitInfo[2]).eq(16);
      expect(maxLimitInfo[3]).eq(0);
      expect(maxLimitInfo[4]).eq(0);
    });

    it("only owner", async function() {
      let sceneIds = [0, 1];
      expect(hangOutETHFlatland.connect(mintSigner).mintReserved(sceneIds)).revertedWith("Ownable: caller is not the owner");
    });

    it("not opened", async function() {
      await hangOutETHFlatland.flipMintState();

      let sceneIds = [0, 1];
      expect(hangOutETHFlatland.mintReserved(sceneIds)).revertedWith("mint not open");
    });

    it("invalid scene id", async function() {
      await hangOutETHFlatland.flipMintState();

      let sceneIds = [0, InvalidScene];
      expect(hangOutETHFlatland.mintReserved(sceneIds)).revertedWith("scene id overrange");

      sceneIds = [InvalidScene, 0];
      expect(hangOutETHFlatland.mintReserved(sceneIds)).revertedWith("scene id overrange");
    });
  });

  context("withdraw", async () => {
    before(async () => {
    });

    beforeEach(async () => {
      hangOutETHFlatland = (await HangOutETHFlatlandFactory.deploy(await mintSigner.getAddress(), SceneMerkleRoot, PlotsMerkleRoot)) as HangOutETHFlatland;
      await hangOutETHFlatland.deployed();

      await hangOutETHFlatland.flipMintState();
      await hangOutETHFlatland.mintScene(0, Mint0Scene0Sign, {value: ScenePrice});
    });

    it("should alright", async function() {
      console.log(await ethers.provider.getBalance(hangOutETHFlatland.address));
      expect(await ethers.provider.getBalance(hangOutETHFlatland.address)).eq(ScenePrice);
      let receiverBeforeBalance = await mintSigner.getBalance();
      console.log(receiverBeforeBalance);
      await hangOutETHFlatland.connect(deployer).withdraw(await mintSigner.getAddress(), ScenePrice);
      console.log(await ethers.provider.getBalance(hangOutETHFlatland.address));
      console.log(await mintSigner.getBalance());
      expect(await ethers.provider.getBalance(hangOutETHFlatland.address)).eq(ethers.BigNumber.from(0));
      expect(await mintSigner.getBalance()).eq(receiverBeforeBalance.add(ScenePrice));
    });

    it("withdraw half", async function() {
      console.log(await ethers.provider.getBalance(hangOutETHFlatland.address));
      expect(await ethers.provider.getBalance(hangOutETHFlatland.address)).eq(ScenePrice);
      let receiverBeforeBalance = await mintSigner.getBalance();
      console.log(receiverBeforeBalance);
      await hangOutETHFlatland.withdraw(await mintSigner.getAddress(), ScenePrice.div(2));
      console.log(await ethers.provider.getBalance(hangOutETHFlatland.address));
      console.log(await mintSigner.getBalance());
      expect(await ethers.provider.getBalance(hangOutETHFlatland.address)).eq(ScenePrice.div(2));
      expect(await mintSigner.getBalance()).eq(receiverBeforeBalance.add(ScenePrice.div(2)));
    });

    it("not owner", async function() {
      expect(hangOutETHFlatland.connect(mintSigner).withdraw(await mintSigner.getAddress(), ScenePrice)).revertedWith("caller is not the owner");
    });

    it("exceed amount", async function() {
      // await hangOutETHFlatland.connect(deployer).withdraw(await mintSigner.getAddress(), ScenePrice.mul(2));
      expect(hangOutETHFlatland.connect(deployer).withdraw(await mintSigner.getAddress(), ScenePrice.mul(2))).revertedWith("");
    });

  });

  context("mint state", async () => {
    before(async () => {
      console.log("it before");
    });

    beforeEach(async () => {
      console.log("it beforeEach");
      hangOutETHFlatland = (await HangOutETHFlatlandFactory.deploy(await mintSigner.getAddress(), SceneMerkleRoot, PlotsMerkleRoot)) as HangOutETHFlatland;
      await hangOutETHFlatland.deployed();
    });

    it("AllSceneMintState", async function() {
      let state = await hangOutETHFlatland.AllSceneMintState();
      const totalMaxSupply = (await hangOutETHFlatland.totalMaxSupply()).toNumber();
      const maxSceneSupply = totalMaxSupply/16;
      expect(state.length === maxSceneSupply);
      for (let i = 0; i < state.length; i++) {
        expect(state[i] === false);
      }

      await hangOutETHFlatland.flipMintState();
      await hangOutETHFlatland.mintScene(0, Mint0Scene0Sign, {value: ScenePrice});
      state = await hangOutETHFlatland.AllSceneMintState();
      expect(state[0]).eq(true);
      for (let i = 1; i < state.length; i++) {
        expect(state[i] === false);
      }

      state = await hangOutETHFlatland.SceneMintState(0);
      console.log(state);
      expect(state.length === 16);
      for (let i = 0; i < 16; i++) {
        expect(state[i]).eq(true);
      }

      for (let i = 1; i < maxSceneSupply; i++) {
        state = await hangOutETHFlatland.SceneMintState(i);
        console.log(i);
        console.log(state);
        expect(state.length).eq(16);
        for (let j = 0; j < 16; j++) {
          expect(state[j]).eq(false);
        }
      }

      for (let i = 0; i < 16; i++) {
        console.log(i);
        expect(await hangOutETHFlatland.PlotMintState(i)).eq(true);
      }

      for (let i = 16; i < totalMaxSupply; i++) {
        console.log(i);
        expect(await hangOutETHFlatland.PlotMintState(i)).eq(false);
      }
    });
  });

});
