import { expect } from "chai";
import { ethers } from "hardhat";

describe("HOPOPool", function () {
  describe("HOPOPool", function () {
    it("HOPOPool", async function () {

      const name = "HangOut Point";
      const symbol = "HOPO";
      const zero_address = "0x0000000000000000000000000000000000000000";

      const [deployer, signer, acc1] = await ethers.getSigners();
      console.log(deployer.address);
      console.log(signer.address);
      console.log(acc1.address);

      const invalidClaimParams = [
        {
          acc: acc1,
          nonce: 10,
          amount: 10000,
          signature: "0x93c6d647e78f85abceede70c9ad977420c995c501226a17fc8dfef3aa42e49584b6c72e0f343f8656edc54ddfb5e37e6a878cfd4a9621efdaa47970f78cffd891c",
          error: "invalid user nonce",
        },
        {
          acc: acc1,
          nonce: 0,
          amount: 30000,
          signature: "0x93c6d647e78f85abceede70c9ad977420c995c501226a17fc8dfef3aa42e49584b6c72e0f343f8656edc54ddfb5e37e6a878cfd4a9621efdaa47970f78cffd891c",
          error: "invalid signature",
        },
      ];

      const claimParams = [
        {
          acc: acc1,
          nonce: 0,
          amount: 10000,
          signature: "0x6367baac097f031d54f15ec6d8a4f8c8b66310498944f4e0f9a4e244c016cd74226a878a10d9de575aa0008feb18f1e3911b9b7b9835dfa998e2547c8fe13af51b",
        },
        {
          acc: acc1,
          nonce: 1,
          amount: 20000,
          signature: "0xf41bee12dde69b7f1d787aa11c8140546d5af3fd004f6a1c971111618e2ca5385e80811c2507c1cedd6e1d6aaf08a701813bdef3de3837abdc941791296f95fa1b",
        },
      ];

      const HangOutPoint = await ethers.getContractFactory("HangOutPoint");
      const hangoutPoint = await HangOutPoint.deploy();


      const HOPOPool = await ethers.getContractFactory("HOPOPool");
      const hopoPool = await HOPOPool.deploy(hangoutPoint.address);
      console.log(`hopoPool: ${hopoPool.address}`);
      await expect(await hangoutPoint.name()).eq(name);
      await expect(await hangoutPoint.symbol()).eq(symbol);
      await expect(await hangoutPoint.totalSupply()).eq(0);
      await expect(await hopoPool.owner()).eq(deployer.address);
      await expect((await hopoPool.functions.signer())[0]).eq(zero_address);
      await expect(await hopoPool.nextNonce(acc1.address)).eq(0);

      // mint
      const mintAmount = ethers.utils.parseEther("100000000");
      await (await hangoutPoint.mint(hopoPool.address, mintAmount)).wait();
      await expect(await hangoutPoint.balanceOf(hopoPool.address)).eq(mintAmount);

      // setSigner
      console.log("setSigner");
      await expect(hopoPool.connect(acc1).setSigner(signer.address)).revertedWith("Ownable: caller is not the owner");
      await (await hopoPool.setSigner(signer.address)).wait();
      await expect((await hopoPool.functions.signer())[0]).eq(signer.address);


      // claim
      console.log("claim");
      for (let i = 0; i < invalidClaimParams.length; i++) {
        await expect(
          hopoPool
            .connect(invalidClaimParams[i].acc)
            .claim(
              invalidClaimParams[i].nonce,
              invalidClaimParams[i].amount,
              invalidClaimParams[i].signature
            )
        ).revertedWith(invalidClaimParams[i].error);
      }

      let totalSupply = 0;
      for (let i = 0; i < claimParams.length; i++) {
        await (
          await hopoPool
            .connect(claimParams[i].acc)
            .claim(
              claimParams[i].nonce,
              claimParams[i].amount,
              claimParams[i].signature
            )
        ).wait();
        totalSupply += claimParams[i].amount;
      }

      console.log(`totalSupply: ${await hangoutPoint.totalSupply()}`);
      console.log(`balanceOf ${acc1.address}: ${await hangoutPoint.balanceOf(acc1.address)}`);
      await expect(await hangoutPoint.balanceOf(acc1.address)).eq(totalSupply);
      await expect(await hopoPool.nextNonce(acc1.address)).eq(2);

      // burn
    });
  });
});
