import { expect } from "chai";
import { ethers } from "hardhat";

describe("HangOutMarket", async () => {
  context("HangOutMarket", async () => {
    it("HangOutMarket", async () => {
      const [deployer, acc1, acc2] = await ethers.getSigners();
      console.log(`deployer: ${deployer.address}`);
      console.log(`acc1: ${acc1.address}`);
      console.log(`acc2: ${acc2.address}`);

      const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

      // money
      const ERC20Test = await ethers.getContractFactory("ERC20Test");
      const usdt = await ERC20Test.deploy("USDT", "USDT");
      await usdt.deployed();
      console.log(`usdt: ${usdt.address}`);

      const usdc = await ERC20Test.deploy("USDC", "USDC");
      await usdc.deployed();
      console.log(`usdc: ${usdc.address}`);


      // HangOutMarket
      const HangOutMarket = await ethers.getContractFactory("HangOutMarket");
      const hangOutMarket = await HangOutMarket.deploy();
      await hangOutMarket.deployed();
      console.log(`hangOutMarket: ${hangOutMarket.address}`);

      // VirtualGoodsShelf
      const VirtualGoodsShelf = await ethers.getContractFactory("VirtualGoodsShelf");
      const virtualGoodsShelf = await VirtualGoodsShelf.deploy("virtualGoodsShelf name", hangOutMarket.address);
      await virtualGoodsShelf.deployed();
      console.log(`virtualGoodsShelf: ${virtualGoodsShelf.address}`);

      // ERC20GoodsShelf
      const erc20Test = await ERC20Test.deploy("ERC20 name", "ERC20Symbol");
      await erc20Test.deployed();
      console.log(`erc20Test: ${erc20Test.address}`);

      const ERC20GoodsShelf = await ethers.getContractFactory("ERC20GoodsShelf");
      const erc20GoodsShelf = await ERC20GoodsShelf.deploy("ERC20GoodsShelf name", erc20Test.address, hangOutMarket.address);
      await erc20GoodsShelf.deployed();
      console.log(`erc20GoodsShelf: ${erc20GoodsShelf.address}`);

      // ERC721GoodsShelf
      const ERC721Test = await ethers.getContractFactory("ERC721Test");
      const erc721Test = await ERC721Test.deploy("ERC721Test name", "ERC721TestSymbol");
      await erc721Test.deployed();
      console.log(`erc721Test: ${erc721Test.address}`);

      const ERC721GoodsShelf = await ethers.getContractFactory("ERC721GoodsShelf");
      const erc721GoodsShelf = await ERC721GoodsShelf.deploy("ERC721GoodsShelf name", erc721Test.address, hangOutMarket.address);
      await erc721GoodsShelf.deployed();
      console.log(`erc721GoodsShelf: ${erc721GoodsShelf.address}`);

      // ERC1155GoodsShelf
      const uri = "http://tet.uri.com";
      const ERC1155Test = await ethers.getContractFactory("ERC1155Test");
      const erc1155Test = await ERC1155Test.deploy(uri);
      await erc1155Test.deployed();
      console.log(`erc1155Test: ${erc1155Test.address}`);

      const ERC1155GoodsShelf = await ethers.getContractFactory("ERC1155GoodsShelf");
      const erc1155GoodsShelf = await ERC1155GoodsShelf.deploy("ERC1155GoodsShelf name", erc1155Test.address, hangOutMarket.address);
      await erc1155GoodsShelf.deployed();
      console.log(`erc1155GoodsShelf: ${erc1155GoodsShelf.address}`);

      // default status
      await expect(await hangOutMarket.name()).eq("HangOut Market (I)");
      await expect(await hangOutMarket.start()).eq(false);

      // setValidMoney
      await expect(hangOutMarket.connect(acc1).setValidMoney(usdt.address, true)).revertedWith("Ownable: caller is not the owner");
      await (await hangOutMarket.setValidMoney(usdt.address, true)).wait();
      await (await hangOutMarket.setValidMoney(usdc.address, true)).wait();
      console.log(`getMoneyInfos: ${await hangOutMarket.getMoneyInfos()}`);

      // putOnGoods
      const moneys2 = [usdt.address, usdc.address];
      const prices2 = [ethers.utils.parseEther("1"), ethers.utils.parseEther("2")];
      const prices3 = [ethers.utils.parseEther("1"), ethers.utils.parseEther("2"), ethers.utils.parseEther("3")];
      const moneys2_zero = [ZERO_ADDRESS, ZERO_ADDRESS];
      const prices2_zero = [0, 0];
      const goodsShelves = [virtualGoodsShelf.address, erc20GoodsShelf.address, erc721GoodsShelf.address, erc1155GoodsShelf.address];

      await expect(hangOutMarket.connect(acc1).putOnGoods(virtualGoodsShelf.address, moneys2, prices2)).revertedWith("Ownable: caller is not the owner");
      await expect(hangOutMarket.putOnGoods(ZERO_ADDRESS, moneys2, prices2)).revertedWith("goods shelf address is zero");
      await expect(hangOutMarket.putOnGoods(usdt.address, moneys2, prices2)).revertedWith("Transaction reverted: function selector was not recognized and there's no fallback function");
      await expect(hangOutMarket.putOnGoods(virtualGoodsShelf.address, moneys2, prices3)).revertedWith("moneys dont match prices");
      await expect(hangOutMarket.putOnGoods(virtualGoodsShelf.address, moneys2_zero, prices2)).revertedWith("money address is zero");
      await expect(hangOutMarket.putOnGoods(virtualGoodsShelf.address, moneys2, prices2_zero)).revertedWith("price is zero");

      for (let i = 0; i < goodsShelves.length; i++) {
        await (await hangOutMarket.putOnGoods(goodsShelves[i], moneys2, prices2)).wait();
      }

      console.log(`getGoodsShelvesInfos: ${await hangOutMarket.getGoodsShelvesInfos()}`);
      console.log(`getMoneyInfos: ${await hangOutMarket.getMoneyInfos()}`);

      for (let i = 0; i < goodsShelves.length; i++) {
        await expect(await hangOutMarket.prices(goodsShelves[i], moneys2[0])).eq(prices2[0]);
        await expect(await hangOutMarket.prices(goodsShelves[i], moneys2[1])).eq(prices2[1]);
      }

      // putOffGoods
      await expect(hangOutMarket.connect(acc1).putOffGoods(virtualGoodsShelf.address)).revertedWith("Ownable: caller is not the owner");
      await expect(hangOutMarket.putOffGoods(ZERO_ADDRESS)).revertedWith("goods shelf address is zero");

      for (let i = 0; i < goodsShelves.length; i++) {
        await (await hangOutMarket.putOffGoods(goodsShelves[i])).wait();
      }

      console.log(`${await hangOutMarket.getGoodsShelvesInfos()}`);

      for (let i = 0; i < goodsShelves.length; i++) {
        await expect(await hangOutMarket.prices(goodsShelves[i], moneys2[0])).eq(0);
        await expect(await hangOutMarket.prices(goodsShelves[i], moneys2[1])).eq(0);
      }

      // exchangeVirtual
      await expect(hangOutMarket.connect(acc1).exchangeVirtual(virtualGoodsShelf.address, usdt.address, 1, acc2.address)).revertedWith("have not start yet");
      await (await hangOutMarket.setStart(true)).wait();
      await expect(await hangOutMarket.start()).eq(true);
      await expect(hangOutMarket.connect(acc1).exchangeVirtual(ZERO_ADDRESS, usdt.address, 1, acc2.address)).revertedWith("goods shelf address is zero");
      await expect(hangOutMarket.connect(acc1).exchangeVirtual(virtualGoodsShelf.address, ZERO_ADDRESS, 1, acc2.address)).revertedWith("money address is zero");
      await expect(hangOutMarket.connect(acc1).exchangeVirtual(virtualGoodsShelf.address, usdt.address, 0, acc2.address)).revertedWith("quantity is zero");
      await expect(hangOutMarket.connect(acc1).exchangeVirtual(virtualGoodsShelf.address, usdt.address, 1, ZERO_ADDRESS)).revertedWith("to is zero");
      await expect(hangOutMarket.connect(acc1).exchangeVirtual(virtualGoodsShelf.address, usdt.address, 1, acc2.address)).revertedWith("goods shelf have not put on");

      await (await hangOutMarket.putOnGoods(virtualGoodsShelf.address, moneys2, prices2)).wait();
      await expect(hangOutMarket.connect(acc1).exchangeVirtual(virtualGoodsShelf.address, usdt.address, 1, acc2.address)).revertedWith("ERC20: insufficient allowance");
      await (await usdt.connect(acc1).approve(hangOutMarket.address, ethers.utils.parseEther("1000000000000000000000")));
      await expect(hangOutMarket.connect(acc1).exchangeVirtual(virtualGoodsShelf.address, usdt.address, 1, acc2.address)).revertedWith("ERC20: transfer amount exceeds balance");
      await (await usdt.connect(deployer).transfer(acc1.address, 10)).wait();
      await expect(await usdt.balanceOf(acc1.address)).eq(10);
      await (await hangOutMarket.connect(acc1).exchangeVirtual(virtualGoodsShelf.address, usdt.address, 1, acc2.address)).wait();
      await expect(await usdt.balanceOf(acc1.address)).eq(9);
      await expect(await usdt.balanceOf(virtualGoodsShelf.address)).eq(1);

      await (await usdc.connect(acc1).approve(hangOutMarket.address, ethers.utils.parseEther("1000000000000000000000")));
      await (await usdc.connect(deployer).transfer(acc1.address, 10)).wait();
      await expect(await usdc.balanceOf(acc1.address)).eq(10);
      await (await hangOutMarket.connect(acc1).exchangeVirtual(virtualGoodsShelf.address, usdc.address, 1, acc2.address)).wait();
      await expect(await usdc.balanceOf(acc1.address)).eq(8);
      await expect(await usdc.balanceOf(virtualGoodsShelf.address)).eq(2);

      await (await virtualGoodsShelf.withdrawMoney(usdt.address, 1, acc2.address)).wait();
      await (await virtualGoodsShelf.withdrawMoney(usdc.address, 2, acc2.address)).wait();
      await expect(await usdt.balanceOf(acc2.address)).eq(1);
      await expect(await usdc.balanceOf(acc2.address)).eq(2);
      await expect(await usdt.balanceOf(virtualGoodsShelf.address)).eq(0);
      await expect(await usdc.balanceOf(virtualGoodsShelf.address)).eq(0);


      // exchangeERC20
      await expect(hangOutMarket.connect(acc1).exchangeERC20(ZERO_ADDRESS, usdt.address, 1, acc2.address)).revertedWith("goods shelf address is zero");
      await expect(hangOutMarket.connect(acc1).exchangeERC20(erc20GoodsShelf.address, ZERO_ADDRESS, 1, acc2.address)).revertedWith("money address is zero");
      await expect(hangOutMarket.connect(acc1).exchangeERC20(erc20GoodsShelf.address, usdt.address, 0, acc2.address)).revertedWith("amount is zero");
      await expect(hangOutMarket.connect(acc1).exchangeERC20(erc20GoodsShelf.address, usdt.address, 1, ZERO_ADDRESS)).revertedWith("to is zero");
      await expect(hangOutMarket.connect(acc1).exchangeERC20(erc20GoodsShelf.address, usdt.address, 1, acc2.address)).revertedWith("goods shelf have not put on");

      await (await hangOutMarket.putOnGoods(erc20GoodsShelf.address, moneys2, prices2)).wait();
      await expect(hangOutMarket.connect(acc1).exchangeVirtual(erc20GoodsShelf.address, usdt.address, 1, acc2.address)).revertedWith("invalid goods shelf type");
      await expect(hangOutMarket.connect(acc1).exchangeERC20(erc20GoodsShelf.address, usdt.address, 1, acc2.address)).revertedWith("ERC20: transfer amount exceeds balance");
      await (await erc20Test.approve(erc20GoodsShelf.address, ethers.utils.parseEther("100000000000000000000")));
      await (await erc20GoodsShelf.stockERC20(100)).wait();
      await expect(await erc20Test.balanceOf(erc20GoodsShelf.address)).eq(100);
      await (await hangOutMarket.connect(acc1).exchangeERC20(erc20GoodsShelf.address, usdt.address, 1, acc2.address)).wait();
      await expect(await usdt.balanceOf(acc1.address)).eq(8);
      await expect(await usdt.balanceOf(erc20GoodsShelf.address)).eq(1);
      await expect(await erc20Test.balanceOf(acc2.address)).eq(1);
      await expect(await erc20Test.balanceOf(erc20GoodsShelf.address)).eq(99);

      await (await hangOutMarket.connect(acc1).exchangeERC20(erc20GoodsShelf.address, usdc.address, 1, acc2.address)).wait();
      await expect(await usdc.balanceOf(acc1.address)).eq(6);
      await expect(await usdc.balanceOf(erc20GoodsShelf.address)).eq(2);
      await expect(await erc20Test.balanceOf(acc2.address)).eq(2);
      await expect(await erc20Test.balanceOf(erc20GoodsShelf.address)).eq(98);

      await (await erc20GoodsShelf.withdrawMoney(usdt.address, 1, acc2.address)).wait();
      await (await erc20GoodsShelf.withdrawMoney(usdc.address, 2, acc2.address)).wait();
      await expect(await usdt.balanceOf(acc2.address)).eq(2);
      await expect(await usdc.balanceOf(acc2.address)).eq(4);
      await expect(await usdt.balanceOf(erc20GoodsShelf.address)).eq(0);
      await expect(await usdc.balanceOf(erc20GoodsShelf.address)).eq(0);

      await expect(erc20GoodsShelf.connect(acc1).withdrawGoods(acc2.address)).revertedWith("Ownable: caller is not the owner");
      await (await erc20GoodsShelf.withdrawGoods(acc2.address)).wait();
      await expect(await erc20Test.balanceOf(acc2.address)).eq(100);
      await expect(await erc20Test.balanceOf(erc20GoodsShelf.address)).eq(0);

      // exchangeERC721
      await expect(hangOutMarket.connect(acc1).exchangeERC721(ZERO_ADDRESS, usdt.address, [0], acc2.address)).revertedWith("goods shelf address is zero");
      await expect(hangOutMarket.connect(acc1).exchangeERC721(erc721GoodsShelf.address, ZERO_ADDRESS, [0], acc2.address)).revertedWith("money address is zero");
      await expect(hangOutMarket.connect(acc1).exchangeERC721(erc721GoodsShelf.address, usdt.address, [], acc2.address)).revertedWith("ERC721 id array length is zero");
      await expect(hangOutMarket.connect(acc1).exchangeERC721(erc721GoodsShelf.address, usdt.address, [0], ZERO_ADDRESS)).revertedWith("to is zero");
      await expect(hangOutMarket.connect(acc1).exchangeERC721(erc721GoodsShelf.address, usdt.address, [0], acc2.address)).revertedWith("goods shelf have not put on");

      await (await hangOutMarket.putOnGoods(erc721GoodsShelf.address, moneys2, prices2)).wait();
      await expect(hangOutMarket.connect(acc1).exchangeVirtual(erc721GoodsShelf.address, usdt.address, 1, acc2.address)).revertedWith("invalid goods shelf type");
      await expect(hangOutMarket.connect(acc1).exchangeERC721(erc721GoodsShelf.address, usdt.address, [0], acc2.address)).revertedWith("ERC721: invalid token ID");

      await (await erc721Test.mint(100)).wait();
      await expect(await erc721Test.balanceOf(deployer.address)).eq(100);
      await (await erc721Test.setApprovalForAll(erc721GoodsShelf.address, true)).wait();
      await (await erc721GoodsShelf.stockERC721([0,1,2,3,4,5,6,7,8,9])).wait();
      await expect(await erc721Test.balanceOf(erc721GoodsShelf.address)).eq(10);
      await expect(await erc721Test.balanceOf(deployer.address)).eq(90);
      await (await hangOutMarket.connect(acc1).exchangeERC721(erc721GoodsShelf.address, usdt.address, [0], acc2.address)).wait();
      await expect(await usdt.balanceOf(acc1.address)).eq(7);
      await expect(await usdt.balanceOf(erc721GoodsShelf.address)).eq(1);
      await expect(await erc721Test.balanceOf(acc2.address)).eq(1);
      await expect(await erc721Test.balanceOf(erc721GoodsShelf.address)).eq(9);

      await (await hangOutMarket.connect(acc1).exchangeERC721(erc721GoodsShelf.address, usdc.address, [1], acc2.address)).wait();
      await expect(await usdc.balanceOf(acc1.address)).eq(4);
      await expect(await usdc.balanceOf(erc721GoodsShelf.address)).eq(2);
      await expect(await erc721Test.balanceOf(acc2.address)).eq(2);
      await expect(await erc721Test.balanceOf(erc721GoodsShelf.address)).eq(8);

      await (await erc721GoodsShelf.withdrawMoney(usdt.address, 1, acc2.address)).wait();
      await (await erc721GoodsShelf.withdrawMoney(usdc.address, 2, acc2.address)).wait();
      await expect(await usdt.balanceOf(acc2.address)).eq(3);
      await expect(await usdc.balanceOf(acc2.address)).eq(6);
      await expect(await usdt.balanceOf(erc721GoodsShelf.address)).eq(0);
      await expect(await usdc.balanceOf(erc721GoodsShelf.address)).eq(0);

      await expect(erc721GoodsShelf.connect(acc1).withdrawERC721([2,3,4,5,6,7,8,9], acc2.address)).revertedWith("Ownable: caller is not the owner");
      await (await erc721GoodsShelf.withdrawERC721([2,3,4,5,6,7,8,9], acc2.address)).wait();
      await expect(await erc721Test.balanceOf(acc2.address)).eq(10);
      await expect(await erc721Test.balanceOf(erc721GoodsShelf.address)).eq(0);


      // exchangeERC1155
      await expect(hangOutMarket.connect(acc1).exchangeERC1155(ZERO_ADDRESS, 0, usdt.address, 1, acc2.address)).revertedWith("goods shelf address is zero");
      await expect(hangOutMarket.connect(acc1).exchangeERC1155(erc1155GoodsShelf.address, 0, ZERO_ADDRESS, 1, acc2.address)).revertedWith("money address is zero");
      await expect(hangOutMarket.connect(acc1).exchangeERC1155(erc1155GoodsShelf.address, 0, usdt.address, 0, acc2.address)).revertedWith("quantity is zero");
      await expect(hangOutMarket.connect(acc1).exchangeERC1155(erc1155GoodsShelf.address, 0, usdt.address, 1, ZERO_ADDRESS)).revertedWith("to is zero");
      await expect(hangOutMarket.connect(acc1).exchangeERC1155(erc1155GoodsShelf.address, 0, usdt.address, 1, acc2.address)).revertedWith("goods shelf have not put on");

      await (await hangOutMarket.putOnGoods(erc1155GoodsShelf.address, moneys2, prices2)).wait();
      await expect(hangOutMarket.connect(acc1).exchangeVirtual(erc1155GoodsShelf.address, usdt.address, 1, acc2.address)).revertedWith("invalid goods shelf type");
      await expect(hangOutMarket.connect(acc1).exchangeERC1155(virtualGoodsShelf.address, 0, usdt.address, 1, acc2.address)).revertedWith("invalid goods shelf type");
      await expect(hangOutMarket.connect(acc1).exchangeERC1155(erc1155GoodsShelf.address, 0, usdt.address, 1, acc2.address)).revertedWith("ERC1155: insufficient balance for transfer");
      await (await erc1155Test.connect(acc1).mint(0, 100)).wait();
      await (await erc1155Test.connect(acc1).mint(1, 100)).wait();
      await expect(await erc1155Test.balanceOf(acc1.address, 0)).eq(100);
      await expect(await erc1155Test.balanceOf(acc1.address, 1)).eq(100);
      await (await erc1155Test.connect(acc1).setApprovalForAll(erc1155GoodsShelf.address, true)).wait();
      await (await erc1155GoodsShelf.connect(acc1).stockERC1155(0, 10)).wait();
      await (await erc1155GoodsShelf.connect(acc1).stockERC1155(1, 10)).wait();
      await expect(await erc1155Test.balanceOf(acc1.address, 0)).eq(90);
      await expect(await erc1155Test.balanceOf(acc1.address, 1)).eq(90);
      await expect(await erc1155Test.balanceOf(erc1155GoodsShelf.address, 0)).eq(10);
      await expect(await erc1155Test.balanceOf(erc1155GoodsShelf.address, 1)).eq(10);
      await (await hangOutMarket.connect(acc1).exchangeERC1155(erc1155GoodsShelf.address, 0, usdt.address, 1, acc2.address)).wait();
      await (await hangOutMarket.connect(acc1).exchangeERC1155(erc1155GoodsShelf.address, 1, usdt.address, 1, acc2.address)).wait();
      await expect(await usdt.balanceOf(acc1.address)).eq(5);
      await expect(await usdt.balanceOf(erc1155GoodsShelf.address)).eq(2);
      await expect(await erc1155Test.balanceOf(acc2.address, 0)).eq(1);
      await expect(await erc1155Test.balanceOf(acc2.address, 1)).eq(1);
      await expect(await erc1155Test.balanceOf(erc1155GoodsShelf.address, 0)).eq(9);
      await expect(await erc1155Test.balanceOf(erc1155GoodsShelf.address, 1)).eq(9);

      await (await hangOutMarket.connect(acc1).exchangeERC1155(erc1155GoodsShelf.address, 0, usdc.address, 1, acc2.address)).wait();
      await (await hangOutMarket.connect(acc1).exchangeERC1155(erc1155GoodsShelf.address, 1, usdc.address, 1, acc2.address)).wait();
      await expect(await usdc.balanceOf(acc1.address)).eq(0);
      await expect(await usdc.balanceOf(erc1155GoodsShelf.address)).eq(4);
      await expect(await erc1155Test.balanceOf(acc2.address, 0)).eq(2);
      await expect(await erc1155Test.balanceOf(acc2.address, 1)).eq(2);
      await expect(await erc1155Test.balanceOf(erc1155GoodsShelf.address, 0)).eq(8);
      await expect(await erc1155Test.balanceOf(erc1155GoodsShelf.address, 1)).eq(8);

      await (await erc1155GoodsShelf.withdrawMoney(usdt.address, 2, acc2.address)).wait();
      await (await erc1155GoodsShelf.withdrawMoney(usdc.address, 4, acc2.address)).wait();
      await expect(await usdt.balanceOf(acc2.address)).eq(5);
      await expect(await usdc.balanceOf(acc2.address)).eq(10);
      await expect(await usdt.balanceOf(erc1155GoodsShelf.address)).eq(0);
      await expect(await usdc.balanceOf(erc20GoodsShelf.address)).eq(0);

      await expect(erc1155GoodsShelf.connect(acc1).withdrawGoods(acc2.address)).revertedWith("Ownable: caller is not the owner");
      await (await erc1155GoodsShelf.withdrawGoods(acc2.address)).wait();
      await expect(await erc1155Test.balanceOf(acc2.address, 0)).eq(10);
      await expect(await erc1155Test.balanceOf(acc2.address, 1)).eq(10);
      await expect(await erc1155Test.balanceOf(erc1155GoodsShelf.address, 0)).eq(0);
      await expect(await erc1155Test.balanceOf(erc1155GoodsShelf.address, 1)).eq(0);
    });
  });
});
