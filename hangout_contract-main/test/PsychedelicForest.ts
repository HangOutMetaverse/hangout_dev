import { expect } from "chai";
import { ethers } from "hardhat";

describe("PsychedelicForest", function () {
  describe("PsychedelicForest", function () {
    it("PsychedelicForest", async function () {
      const [deployer, player] = await ethers.getSigners();
      console.log(`deployer: ${deployer.address}`);
      console.log(`player: ${player.address}`);

      const uri = "https://rmb.uri/";
      const name = "RawMaterialsBox";
      const symbol = "RMB";
      const RawMaterialsBox = await ethers.getContractFactory("RawMaterialsBox");
      const rawMaterialsBox = await RawMaterialsBox.deploy(uri, name, symbol);
      await rawMaterialsBox.deployed();

      const DEFAULT_INTERVAL = 60;
      const ROOT_DESCRIPTION = "root description";
      const ROOT_DESCRIPTION2 = "root description 2";
      const PsychedelicForest = await ethers.getContractFactory("PsychedelicForest");
      const psychedelicForest = await PsychedelicForest.deploy(ROOT_DESCRIPTION, DEFAULT_INTERVAL);
      await psychedelicForest.deployed();

      // setMinter
      await rawMaterialsBox.setMinter(psychedelicForest.address, true);

      //
      console.log(`name: ${await psychedelicForest.name()}`);
      console.log(`levelRoot: ${await psychedelicForest.levelRoot()}`);

      // setStart
      await expect(await psychedelicForest.start()).eq(false);
      await expect(psychedelicForest.connect(player).setStart(true)).revertedWith("Ownable: caller is not the owner");
      await (await psychedelicForest.setStart(true)).wait();
      await expect(await psychedelicForest.start()).eq(true);


      // setRootDescription
      let levelRoot = await psychedelicForest.levelRoot();
      await expect(levelRoot.description).eq(ROOT_DESCRIPTION);
      await expect(psychedelicForest.connect(player).setRootDescription(ROOT_DESCRIPTION2)).revertedWith("Ownable: caller is not the owner");
      await (await psychedelicForest.setRootDescription(ROOT_DESCRIPTION2)).wait();
      levelRoot = await psychedelicForest.levelRoot();
      await expect(levelRoot.description).eq(ROOT_DESCRIPTION2);

      // setInterval
      await expect(await psychedelicForest.interval()).eq(DEFAULT_INTERVAL);
      await expect(psychedelicForest.connect(player).setInterval(DEFAULT_INTERVAL*2)).revertedWith("Ownable: caller is not the owner");
      await (await psychedelicForest.setInterval(DEFAULT_INTERVAL*2)).wait();
      await expect(await psychedelicForest.interval()).eq(DEFAULT_INTERVAL*2);

      // setRawMaterialsBox
      const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
      await expect(await psychedelicForest.rawMaterialsBox()).eq(ZERO_ADDRESS);
      await expect(await psychedelicForest.rawMaterialsBoxId()).eq(0);
      await expect(psychedelicForest.connect(player).setRawMaterialsBox(rawMaterialsBox.address, 0)).revertedWith("Ownable: caller is not the owner");
      await (await psychedelicForest.setRawMaterialsBox(rawMaterialsBox.address, 0)).wait();
      await expect(await psychedelicForest.rawMaterialsBox()).eq(rawMaterialsBox.address);

      // setLevels
      const subLevel1 = [
        {
          description: "level 1, sub 1",
          probability: 6000,
          dropLoot: false,
          subLevelCount: 0,
        },
        {
          description: "level 1, sub 2",
          probability: 4000,
          dropLoot: true,
          subLevelCount: 0,
        },
      ];

      const subLevel2 = [
        {
          description: "level 2, sub 1",
          probability: 3000,
          dropLoot: true,
          subLevelCount: 0,
        },
        {
          description: "level 2, sub 2",
          probability: 7000,
          dropLoot: false,
          subLevelCount: 0,
        },
      ];

      const invalidSubLevel1 = [
        {
          description: "level 1, sub 1",
          probability: 2000,
          dropLoot: false,
          subLevelCount: 0,
        },
        {
          description: "level 1, sub 2",
          probability: 2000,
          dropLoot: true,
          subLevelCount: 0,
        },
      ];
      await (await psychedelicForest.setStart(true)).wait();
      await expect(psychedelicForest.connect(player).setLevels([], subLevel1)).revertedWith("Ownable: caller is not the owner");
      await expect(psychedelicForest.setLevels([], subLevel1)).revertedWith("need stop adventure first");
      await (await psychedelicForest.setStart(false)).wait();
      await (await psychedelicForest.setLevels([], subLevel1)).wait();
      let subLevel1Info = await psychedelicForest.getSubLevels([]);
      console.log(`subLevel1Info: ${subLevel1Info}`);
      expect(subLevel1Info.length).eq(2);
      expect(subLevel1Info[0].description).eq("level 1, sub 1");
      expect(subLevel1Info[0].probability).eq(6000);
      expect(subLevel1Info[0].dropLoot).eq(false);
      expect(subLevel1Info[0].subLevelCount).eq(0);
      expect(subLevel1Info[1].description).eq("level 1, sub 2");
      expect(subLevel1Info[1].probability).eq(4000);
      expect(subLevel1Info[1].dropLoot).eq(true);
      expect(subLevel1Info[1].subLevelCount).eq(0);

      await expect(psychedelicForest.setLevels([], invalidSubLevel1)).revertedWith("invalid sub levels total probability");

      await (await psychedelicForest.setLevels([0], subLevel2)).wait();
      const subLevel2Info = await psychedelicForest.getSubLevels([0]);
      console.log(`subLevel2Info: ${subLevel2Info}`);
      expect(subLevel2Info.length).eq(2);
      expect(subLevel2Info[0].description).eq("level 2, sub 1");
      expect(subLevel2Info[0].probability).eq(3000);
      expect(subLevel2Info[0].dropLoot).eq(true);
      expect(subLevel2Info[0].subLevelCount).eq(0);
      expect(subLevel2Info[1].description).eq("level 2, sub 2");
      expect(subLevel2Info[1].probability).eq(7000);
      expect(subLevel2Info[1].dropLoot).eq(false);
      expect(subLevel2Info[1].subLevelCount).eq(0);

      subLevel1Info = await psychedelicForest.getSubLevels([]);
      console.log(`subLevel1Info: ${subLevel1Info}`);
      expect(subLevel1Info[0].subLevelCount).eq(2);


      // adventure
      await (await psychedelicForest.setStart(false)).wait();
      await expect(psychedelicForest.connect(player).adventure()).revertedWith("have stopped");
      await (await psychedelicForest.setStart(true)).wait();
      await (await psychedelicForest.connect(player).adventure()).wait();
      const adventurerLog = await psychedelicForest.getAdventurerLog(player.address, 0);
      console.log(`adventurerLog: ${adventurerLog}`);
      console.log(`getLevelPathInfoFromId: ${await psychedelicForest.getLevelPathInfoFromId(player.address, 0)}`);
      console.log(`getLevelPathInfo: ${await psychedelicForest.getLevelPathInfo(adventurerLog)}`);
      console.log(`rawMaterialsBox balanceOf: ${await rawMaterialsBox.balanceOf(player.address, 0)}`);


    });
  });
});
