import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC721GoodsShelf", async () => {
  context("ERC721GoodsShelf", async () => {
    it("ERC721GoodsShelf", async () => {
      const [deployer, caller, acc1] = await ethers.getSigners();
      console.log(`deployer: ${deployer.address}`);
      console.log(`caller: ${caller.address}`);
      console.log(`acc1: ${acc1.address}`);

      const erc721name = "erc721 test";
      const erc721symbol = "erc721test";
      const ERC721Test = await ethers.getContractFactory("ERC721Test");
      const erc721Test = await ERC721Test.deploy(erc721name, erc721symbol);
      await erc721Test.deployed();
      console.log(`erc721Test: ${erc721Test.address}`);

      await (await erc721Test.connect(acc1).mint(4)).wait();
      await expect(await erc721Test.balanceOf(acc1.address)).eq(4);

      const name = "test name";

      const ERC721GoodsShelf = await ethers.getContractFactory("ERC721GoodsShelf");
      const erc721GoodsShelf = await ERC721GoodsShelf.deploy(name, erc721Test.address, caller.address);
      await erc721GoodsShelf.deployed();
      console.log(`erc721GoodsShelf: ${erc721GoodsShelf.address}`);

      await expect(await erc721GoodsShelf.name()).eq(name);
      await expect(await erc721GoodsShelf.goods()).eq(erc721Test.address);
      await expect(await erc721GoodsShelf.goodsType()).eq(2);
      await expect(await erc721GoodsShelf.caller()).eq(caller.address);

      await (await erc721Test.connect(acc1).setApprovalForAll(erc721GoodsShelf.address, true)).wait();
      await expect(erc721GoodsShelf.connect(acc1).stockVirtual(1)).revertedWith("invalid goods type");
      await expect(erc721GoodsShelf.connect(acc1).stockERC20(2)).revertedWith("invalid goods type");
      await (await erc721GoodsShelf.connect(acc1).stockERC721([0, 1, 2, 3])).wait();
      await expect(erc721GoodsShelf.connect(acc1).stockERC1155(0, 1)).revertedWith("invalid goods type");

      await expect(await erc721Test.balanceOf(erc721GoodsShelf.address)).eq(4);

      await expect(erc721GoodsShelf.connect(acc1).exchangedVirtual(1, acc1.address)).revertedWith("invalid goods type");
      await expect(erc721GoodsShelf.connect(acc1).exchangedERC20(1, caller.address)).revertedWith("invalid goods type");
      await (await erc721GoodsShelf.connect(caller).exchangedERC721([0, 1], caller.address)).wait();
      await expect(erc721GoodsShelf.connect(acc1).exchangedERC1155(0, 1, acc1.address)).revertedWith("invalid goods type");

      await expect(await erc721Test.balanceOf(caller.address)).eq(2);

      await expect(erc721GoodsShelf.connect(acc1).withdrawGoods(deployer.address)).revertedWith("Ownable: caller is not the owner");
      await expect(erc721GoodsShelf.connect(acc1).withdrawERC721([2, 3], deployer.address)).revertedWith("Ownable: caller is not the owner");
      await (await erc721GoodsShelf.withdrawERC721([2, 3], caller.address)).wait();
      await expect(await erc721Test.balanceOf(caller.address)).eq(4);

    });
  });
});
