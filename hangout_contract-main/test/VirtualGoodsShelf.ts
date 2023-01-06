import { expect } from "chai";
import { ethers } from "hardhat";

describe("VirtualGoodsShelf", async () => {
  context("VirtualGoodsShelf", async () => {
    it("VirtualGoodsShelf", async () => {
      const [deployer, caller, acc1] = await ethers.getSigners();
      console.log(`deployer: ${deployer.address}`);
      console.log(`caller: ${caller.address}`);
      console.log(`acc1: ${acc1.address}`);

      const name = "test name";
      const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

      const VirtualGoodsShelf = await ethers.getContractFactory("VirtualGoodsShelf");
      const virtualGoodsShelf = await VirtualGoodsShelf.deploy(name, caller.address);
      await virtualGoodsShelf.deployed();
      console.log(`virtualGoodsShelf: ${virtualGoodsShelf.address}`);

      await expect(await virtualGoodsShelf.name()).eq(name);
      await expect(await virtualGoodsShelf.goods()).eq(ZERO_ADDRESS);
      await expect(await virtualGoodsShelf.goodsType()).eq(0);
      await expect(await virtualGoodsShelf.caller()).eq(caller.address);

      await (await virtualGoodsShelf.stockVirtual(1)).wait();
      await expect(virtualGoodsShelf.stockERC20(1)).revertedWith("invalid goods type");
      await expect(virtualGoodsShelf.stockERC721([1])).revertedWith("invalid goods type");
      await expect(virtualGoodsShelf.stockERC1155(0, 1)).revertedWith("invalid goods type");

      await (await virtualGoodsShelf.connect(caller).exchangedVirtual(1, acc1.address)).wait();
      await expect(virtualGoodsShelf.exchangedERC20(1, acc1.address)).revertedWith("invalid goods type");
      await expect(virtualGoodsShelf.exchangedERC721([1], acc1.address)).revertedWith("invalid goods type");
      await expect(virtualGoodsShelf.exchangedERC1155(0, 1, acc1.address)).revertedWith("invalid goods type");
    });
  });
});
