import { expect } from "chai";
import { ethers } from "hardhat";

describe("HangoutMintPass", function () {
  describe("HangoutMintPass", function () {
    it("HangoutMintPass", async function () {

      const [deployer, acc1, acc2] = await ethers.getSigners();
      console.log(deployer.address);
      console.log(acc1.address);
      console.log(acc2.address);

      const baseURI = "http://test.baseuri.com/";

      const HangoutMintPass = await ethers.getContractFactory("HangoutMintPass");
      const hangoutMintPass = await HangoutMintPass.deploy();

      console.log(`hangoutMintPass: ${hangoutMintPass.address}`);

      await expect(await hangoutMintPass.name()).eq("Hangout Mint Pass");
      await expect(await hangoutMintPass.symbol()).eq("Hangout Mint Pass");
      await expect(await hangoutMintPass.baseURI()).eq("");
      await expect(await hangoutMintPass.owner()).eq(deployer.address);
      await expect(await hangoutMintPass.totalMaxSupply()).eq(10000);
      await expect(await hangoutMintPass.totalSupply()).eq(0);

      // setBaseURI
      await expect(hangoutMintPass.connect(acc1).setBaseURI(baseURI)).revertedWith("Ownable: caller is not the owner");
      await (await hangoutMintPass.setBaseURI(baseURI)).wait();
      await expect(await hangoutMintPass.baseURI()).eq(baseURI);

      // mint
      const fstMintCnt = 2;
      await expect(hangoutMintPass.connect(acc1).mint([acc1.address], [fstMintCnt])).revertedWith("Ownable: caller is not the owner");
      await (await hangoutMintPass.mint([acc1.address], [fstMintCnt])).wait();
      await expect(await hangoutMintPass.totalSupply()).eq(fstMintCnt);
      await expect(await hangoutMintPass.balanceOf(acc1.address)).eq(fstMintCnt);
      for (let i = 0; i < fstMintCnt; i++) {
        await expect(await hangoutMintPass.ownerOf(i)).eq(acc1.address);
      }

      await (await hangoutMintPass.mint([acc1.address, acc2.address], [fstMintCnt, fstMintCnt*2])).wait();
      await expect(await hangoutMintPass.totalSupply()).eq(fstMintCnt*4);
      await expect(await hangoutMintPass.balanceOf(acc1.address)).eq(fstMintCnt*2);
      await expect(await hangoutMintPass.balanceOf(acc2.address)).eq(fstMintCnt*2);
      for (let i = fstMintCnt; i < fstMintCnt*2; i++) {
        await expect(await hangoutMintPass.ownerOf(i)).eq(acc1.address);
      }
      for (let i = fstMintCnt*2; i < fstMintCnt*4; i++) {
        await expect(await hangoutMintPass.ownerOf(i)).eq(acc2.address);
      }

      // tokenURI
      await expect(await hangoutMintPass.tokenURI(0)).eq(baseURI+"0");
      await expect(await hangoutMintPass.tokenURI(3)).eq(baseURI+"3");
    });
  });
});
