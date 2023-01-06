import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC1155GoodsShelf", async () => {
  context("ERC1155GoodsShelf", async () => {
    it("ERC1155GoodsShelf", async () => {
      const [deployer, caller, acc1] = await ethers.getSigners();
      console.log(`deployer: ${deployer.address}`);
      console.log(`caller: ${caller.address}`);
      console.log(`acc1: ${acc1.address}`);

      const uri = "http://tet.uri.com";
      const ERC1155Test = await ethers.getContractFactory("ERC1155Test");
      const erc1155Test = await ERC1155Test.deploy(uri);
      await erc1155Test.deployed();
      console.log(`erc1155Test: ${erc1155Test.address}`);
      await (await erc1155Test.connect(acc1).mint(0, 1000)).wait();
      await (await erc1155Test.connect(acc1).mint(1, 1000)).wait();
      await expect(await erc1155Test.balanceOf(acc1.address, 0)).eq(1000);
      await expect(await erc1155Test.balanceOf(acc1.address, 1)).eq(1000);

      const name = "test name";

      const ERC1155GoodsShelf = await ethers.getContractFactory("ERC1155GoodsShelf");
      const erc1155GoodsShelf = await ERC1155GoodsShelf.deploy(name, erc1155Test.address, caller.address);
      await erc1155GoodsShelf.deployed();
      console.log(`erc1155GoodsShelf: ${erc1155GoodsShelf.address}`);

      await expect(await erc1155GoodsShelf.name()).eq(name);
      await expect(await erc1155GoodsShelf.goods()).eq(erc1155Test.address);
      await expect(await erc1155GoodsShelf.goodsType()).eq(3);
      await expect(await erc1155GoodsShelf.caller()).eq(caller.address);

      await (await erc1155Test.connect(acc1).setApprovalForAll(erc1155GoodsShelf.address, true)).wait();
      await expect(erc1155GoodsShelf.connect(acc1).stockVirtual(1)).revertedWith("invalid goods type");
      await expect(erc1155GoodsShelf.connect(acc1).stockERC20(1)).revertedWith("invalid goods type");
      await expect(erc1155GoodsShelf.connect(acc1).stockERC721([1])).revertedWith("invalid goods type");
      await (await erc1155GoodsShelf.connect(acc1).stockERC1155(0, 2)).wait();
      await (await erc1155GoodsShelf.connect(acc1).stockERC1155(1, 2)).wait();

      await expect(await erc1155Test.balanceOf(erc1155GoodsShelf.address, 0)).eq(2);
      await expect(await erc1155Test.balanceOf(erc1155GoodsShelf.address, 1)).eq(2);

      await expect(erc1155GoodsShelf.connect(acc1).exchangedVirtual(1, acc1.address)).revertedWith("invalid goods type");
      await expect(erc1155GoodsShelf.connect(acc1).exchangedERC20(1, acc1.address)).revertedWith("invalid goods type");
      await expect(erc1155GoodsShelf.connect(acc1).exchangedERC721([1], acc1.address)).revertedWith("invalid goods type");
      await (await erc1155GoodsShelf.connect(caller).exchangedERC1155(0, 1, caller.address)).wait();
      await (await erc1155GoodsShelf.connect(caller).exchangedERC1155(1, 1, caller.address)).wait();

      await expect(await erc1155Test.balanceOf(caller.address, 0)).eq(1);
      await expect(await erc1155Test.balanceOf(caller.address, 1)).eq(1);

      await expect(erc1155GoodsShelf.connect(acc1).withdrawGoods(deployer.address)).revertedWith("Ownable: caller is not the owner");
      await (await erc1155GoodsShelf.withdrawGoods(deployer.address)).wait();
      await expect(await erc1155Test.balanceOf(deployer.address, 0)).eq(1);
      await expect(await erc1155Test.balanceOf(deployer.address, 1)).eq(1);
    });
  });
});
