import { expect } from "chai";
import { ethers } from "hardhat";

describe("RawMaterialsBox", function () {
  describe("RawMaterialsBox", function () {
    it("RawMaterialsBox", async function () {
      const [deployer, minter, acc1] = await ethers.getSigners();
      console.log(`deployer: ${deployer.address}`);
      console.log(`minter: ${minter.address}`);
      console.log(`acc1: ${acc1.address}`);

      const uri = "https://rmb.uri/";
      const uri2 = "https://rmb.uri2/";
      const name = "RawMaterialsBox";
      const symbol = "RMB";
      const RawMaterialsBox = await ethers.getContractFactory("RawMaterialsBox");
      const rawMaterialsBox = await RawMaterialsBox.deploy(uri, name, symbol);
      await rawMaterialsBox.deployed();

      await expect(await rawMaterialsBox.name()).eq(name);
      await expect(await rawMaterialsBox.symbol()).eq(symbol);
      await expect(await rawMaterialsBox.totalSupply(0)).eq(0);
      await expect(await rawMaterialsBox.exists(0)).eq(false);
      await expect(await rawMaterialsBox.owner()).eq(deployer.address);
      await expect(rawMaterialsBox.uri(0)).revertedWith("URI: nonexistent token");

      // setMinter
      await expect(await rawMaterialsBox.minters(minter.address)).eq(false);
      await expect(rawMaterialsBox.connect(acc1).setMinter(minter.address, true)).revertedWith("Ownable: caller is not the owner");
      await (await rawMaterialsBox.setMinter(minter.address, true)).wait();
      await expect(await rawMaterialsBox.minters(minter.address)).eq(true);

      // mint
      await expect(rawMaterialsBox.connect(acc1).mint(deployer.address, 0, 1)).revertedWith("caller is not minter");
      await (await rawMaterialsBox.connect(minter).mint(deployer.address, 0, 1)).wait();
      await expect(await rawMaterialsBox.balanceOf(deployer.address, 0)).eq(1);
      await expect(await rawMaterialsBox.exists(0)).eq(true);
      await expect(await rawMaterialsBox.totalSupply(0)).eq(1);
      await expect(await rawMaterialsBox.uri(0)).eq(uri + "0");
      await (await rawMaterialsBox.connect(minter).mint(deployer.address, 0, 10)).wait();
      await expect(await rawMaterialsBox.balanceOf(deployer.address, 0)).eq(11);

      // setURI
      await expect(rawMaterialsBox.connect(acc1).setURI(uri2)).revertedWith("Ownable: caller is not the owner");
      await (await rawMaterialsBox.setURI(uri2)).wait();
      await expect(await rawMaterialsBox.uri(0)).eq(uri2 + "0");

      // burn
      await expect(rawMaterialsBox.connect(minter).burn(deployer.address, 0, 1)).revertedWith("ERC1155: caller is not owner nor approved");
      await (await rawMaterialsBox.burn(deployer.address, 0 , 1)).wait();
      await expect(await rawMaterialsBox.balanceOf(deployer.address, 0)).eq(10);
      await expect(await rawMaterialsBox.totalSupply(0)).eq(10);
      await (await rawMaterialsBox.burn(deployer.address, 0 , 5)).wait();
      await expect(await rawMaterialsBox.balanceOf(deployer.address, 0)).eq(5);
      await expect(await rawMaterialsBox.totalSupply(0)).eq(5);

      // burnBatch
      await (await rawMaterialsBox.connect(minter).mint(deployer.address, 1, 10)).wait();
      await expect(rawMaterialsBox.connect(minter).burnBatch(deployer.address, [0, 1], [5, 5])).revertedWith("ERC1155: caller is not owner nor approved");
      await (await rawMaterialsBox.burnBatch(deployer.address, [0, 1] , [5, 5])).wait();
      await expect(await rawMaterialsBox.balanceOf(deployer.address, 0)).eq(0);
      await expect(await rawMaterialsBox.totalSupply(0)).eq(0);
      await expect(await rawMaterialsBox.balanceOf(deployer.address, 1)).eq(5);
      await expect(await rawMaterialsBox.totalSupply(1)).eq(5);
    });
  });
});
