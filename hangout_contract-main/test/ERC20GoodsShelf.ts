import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20GoodsShelf", async () => {
  context("ERC20GoodsShelf", async () => {
    it("ERC20GoodsShelf", async () => {
      const [deployer, caller, acc1] = await ethers.getSigners();
      console.log(`deployer: ${deployer.address}`);
      console.log(`caller: ${caller.address}`);
      console.log(`acc1: ${acc1.address}`);

      const erc20name = "erc20 test";
      const erc20symbol = "erc20test";
      const ERC20Test = await ethers.getContractFactory("ERC20Test");
      const erc20Test = await ERC20Test.deploy(erc20name, erc20symbol);
      await erc20Test.deployed();
      console.log(`erc20Test: ${erc20Test.address}`);
      console.log(`total balance: ${await erc20Test.balanceOf(deployer.address)}`);

      await (await erc20Test.transfer(acc1.address, ethers.utils.parseEther("10000000000"))).wait();
      console.log(`deployer balance: ${await erc20Test.balanceOf(deployer.address)}`);
      console.log(`acc1 balance: ${await erc20Test.balanceOf(acc1.address)}`);

      const name = "test name";

      const ERC20GoodsShelf = await ethers.getContractFactory("ERC20GoodsShelf");
      const erc20GoodsShelf = await ERC20GoodsShelf.deploy(name, erc20Test.address, caller.address);
      await erc20GoodsShelf.deployed();
      console.log(`erc20GoodsShelf: ${erc20GoodsShelf.address}`);

      await expect(await erc20GoodsShelf.name()).eq(name);
      await expect(await erc20GoodsShelf.goods()).eq(erc20Test.address);
      await expect(await erc20GoodsShelf.goodsType()).eq(1);
      await expect(await erc20GoodsShelf.caller()).eq(caller.address);

      await (await erc20Test.connect(acc1).approve(erc20GoodsShelf.address, 100000)).wait();
      await expect(erc20GoodsShelf.connect(acc1).stockVirtual(1)).revertedWith("invalid goods type");
      await (await erc20GoodsShelf.connect(acc1).stockERC20(2)).wait();
      await expect(erc20GoodsShelf.connect(acc1).stockERC721([1])).revertedWith("invalid goods type");
      await expect(erc20GoodsShelf.connect(acc1).stockERC1155(0, 1)).revertedWith("invalid goods type");

      await expect(await erc20Test.balanceOf(erc20GoodsShelf.address)).eq(2);

      await expect(erc20GoodsShelf.connect(acc1).exchangedVirtual(1, acc1.address)).revertedWith("invalid goods type");
      await (await erc20GoodsShelf.connect(caller).exchangedERC20(1, caller.address)).wait();
      await expect(erc20GoodsShelf.connect(acc1).exchangedERC721([1], acc1.address)).revertedWith("invalid goods type");
      await expect(erc20GoodsShelf.connect(acc1).exchangedERC1155(0, 1, acc1.address)).revertedWith("invalid goods type");

      await expect(await erc20Test.balanceOf(caller.address)).eq(1);

      await expect(erc20GoodsShelf.connect(acc1).withdrawGoods(deployer.address)).revertedWith("Ownable: caller is not the owner");
      await (await erc20GoodsShelf.withdrawGoods(caller.address)).wait();
      await expect(await erc20Test.balanceOf(caller.address)).eq(2);

    });
  });
});
