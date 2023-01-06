import { expect } from "chai";
import { ethers } from "hardhat";

describe("HangOutMarketV1", async () => {
  context("HangOutMarketV1", async () => {
    it("HangOutMarketV1", async () => {
      const [deployer, signer, acc1] = await ethers.getSigners();
      console.log(`deployer: ${deployer.address}`);
      console.log(`signer: ${signer.address}`);
      console.log(`acc1: ${acc1.address}`);

      const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

      // money
      const ERC20Test = await ethers.getContractFactory("ERC20Test");
      const usdt = await ERC20Test.deploy("USDT", "USDT");
      await usdt.deployed();
      console.log(`usdt: ${usdt.address}`);

      await (await usdt.transfer(acc1.address, 10000)).wait();
      console.log(`acc1 usdt balance: ${await usdt.balanceOf(acc1.address)}`);

      // HangOutMarketV1
      const HangOutMarketV1 = await ethers.getContractFactory("HangOutMarketV1");
      const hangOutMarketV1 = await HangOutMarketV1.deploy();
      await hangOutMarketV1.deployed();
      console.log(`hangOutMarketV1: ${hangOutMarketV1.address}`);

      // default status
      await expect(await hangOutMarketV1.name()).eq("HangOut Market V1");
      await expect(await hangOutMarketV1.start()).eq(false);
      await expect((await hangOutMarketV1.functions.signer())[0]).eq(ZERO_ADDRESS);

      // setStart
      await expect(hangOutMarketV1.connect(signer).setStart(true)).revertedWith("Ownable: caller is not the owner");
      await (await hangOutMarketV1.setStart(true)).wait();
      await expect(await hangOutMarketV1.start()).eq(true);

      // setSigner
      await expect(hangOutMarketV1.connect(signer).setSigner(signer.address)).revertedWith("Ownable: caller is not the owner");
      await (await hangOutMarketV1.setSigner(signer.address)).wait();
      await expect((await hangOutMarketV1.functions.signer())[0]).eq(signer.address);
      console.log(`singer: ${await hangOutMarketV1.functions.signer()}`);

      // setInventoryQuantity
      await expect(hangOutMarketV1.connect(signer).setInventoryQuantity(0, 10)).revertedWith("Ownable: caller is not the owner");
      await (await hangOutMarketV1.setInventoryQuantity(0, 10)).wait();
      await expect(await hangOutMarketV1.inventoryQuantity(0)).eq(10);

      // exchange
      const signature = "0x7e0294825aa988d3d4bc9a44553a9915592cb5c1f28906617fd78c5fd8e623617f430f93d5ea3fe91deebc2c7621b0e43ce07c009d966acdd6a75bbe3a6ebcaa1c";
      const invalidSignature = "0x111111111111111111";
      const comment = "0x11223344556677889900";
      await (await usdt.connect(acc1).approve(hangOutMarketV1.address, 10000)).wait();
      await (await hangOutMarketV1.setStart(false)).wait();
      await expect(hangOutMarketV1.connect(acc1).exchange(0, 1, usdt.address, 1, ZERO_ADDRESS, "0x", comment, signature)).revertedWith("have not start yet");
      await (await hangOutMarketV1.setStart(true)).wait();
      await expect(hangOutMarketV1.connect(acc1).exchange(0, 100, usdt.address, 1, ZERO_ADDRESS, "0x", comment, signature)).revertedWith("not enough inventory");
      await expect(hangOutMarketV1.connect(acc1).exchange(0, 1, usdt.address, 1, ZERO_ADDRESS, "0x", comment, invalidSignature)).revertedWith("invalid signature");
      await (await hangOutMarketV1.connect(acc1).exchange(0, 1, usdt.address, 1, ZERO_ADDRESS, "0x", comment, signature)).wait();
      await expect(await usdt.balanceOf(hangOutMarketV1.address)).eq(1);
      await expect(await usdt.balanceOf(acc1.address)).eq(9999);
    });
  });
});
